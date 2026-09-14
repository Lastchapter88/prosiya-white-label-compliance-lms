import { auth as firebaseAuth, db } from '$lib/firebase';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	updateProfile,
	GoogleAuthProvider,
	signInWithPopup,
	signInWithRedirect,
	getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { isAdminEmail, normalizeEmail } from '$lib/config/admins';

const GOOGLE_REDIRECT_KEY = 'prosiya_google_redirect';

function googleProvider() {
	const provider = new GoogleAuthProvider();
	provider.setCustomParameters({ prompt: 'select_account' });
	provider.addScope('email');
	provider.addScope('profile');
	return provider;
}

export async function ensureFirestoreUser(user: {
	uid: string;
	email?: string | null;
	displayName?: string | null;
}) {
	const userRef = doc(db, 'users', user.uid);
	const userSnap = await getDoc(userRef);
	const email = normalizeEmail(user.email || '');
	const role = isAdminEmail(email) ? 'admin' : 'student';

	if (!userSnap.exists()) {
		const displayName = user.displayName || '';
		const parts = displayName.trim().split(/\s+/);
		const firstName = parts[0] || '';
		const lastName = parts.slice(1).join(' ') || '';
		await setDoc(userRef, {
			firstName,
			lastName,
			email,
			role,
			paymentStatus: 'unpaid',
			createdAt: new Date().toISOString(),
			isActive: true,
			updatedAt: new Date().toISOString()
		});
		return;
	}

	if (isAdminEmail(email) && userSnap.data().role !== 'admin') {
		await updateDoc(userRef, {
			role: 'admin',
			updatedAt: new Date().toISOString()
		});
	}
}

export const authService = {
	async login(credentials: { email: string; password: string }) {
		const { email, password } = credentials;
		const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
		try {
			await ensureFirestoreUser(result.user);
		} catch (profileErr) {
			console.error('Profile sync after login failed:', profileErr);
		}
		return result.user;
	},

	async loginWithGoogle(redirectUrl?: string) {
		if (typeof window !== 'undefined' && redirectUrl) {
			sessionStorage.setItem(GOOGLE_REDIRECT_KEY, redirectUrl);
		}

		const provider = googleProvider();
		try {
			const result = await signInWithPopup(firebaseAuth, provider);
			try {
				await ensureFirestoreUser(result.user);
			} catch (profileErr) {
				console.error('Profile sync after Google sign-in failed:', profileErr);
			}
			if (typeof window !== 'undefined') {
				sessionStorage.removeItem(GOOGLE_REDIRECT_KEY);
			}
			return result.user;
		} catch (err: any) {
			const code = String(err?.code || '');
			const useRedirect =
				code === 'auth/popup-blocked' ||
				code === 'auth/operation-not-supported-in-this-environment';
			if (useRedirect) {
				await signInWithRedirect(firebaseAuth, provider);
				return undefined;
			}
			throw err;
		}
	},

	async handleGoogleRedirect(): Promise<{ user?: any; redirectUrl?: string; error?: string }> {
		const storedRedirect =
			typeof window !== 'undefined' ? sessionStorage.getItem(GOOGLE_REDIRECT_KEY) : null;
		try {
			const result = await getRedirectResult(firebaseAuth);
			if (result?.user) {
				try {
					await ensureFirestoreUser(result.user);
				} catch (profileErr) {
					console.error('Profile sync after Google sign-in failed:', profileErr);
				}
				if (typeof window !== 'undefined') {
					sessionStorage.removeItem(GOOGLE_REDIRECT_KEY);
				}
				return { user: result.user, redirectUrl: storedRedirect || undefined };
			}
			return { redirectUrl: storedRedirect || undefined };
		} catch (err: any) {
			return { error: err?.message || 'Google sign-in failed' };
		}
	},

	async register(userData: {
		email: string;
		password: string;
		first_name?: string;
		last_name?: string;
	}) {
		const { email, password, first_name, last_name } = userData;
		const normalizedEmail = normalizeEmail(email);

		const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);

		if (first_name && last_name) {
			try {
				await updateProfile(result.user, {
					displayName: `${first_name} ${last_name}`
				});
			} catch (profileUpdateErr) {
				console.error('Display name update failed:', profileUpdateErr);
			}
		}

		try {
			await setDoc(doc(db, 'users', result.user.uid), {
				firstName: first_name,
				lastName: last_name,
				email: normalizedEmail,
				role: isAdminEmail(normalizedEmail) ? 'admin' : 'student',
				paymentStatus: 'unpaid',
				createdAt: new Date().toISOString(),
				isActive: true,
				updatedAt: new Date().toISOString()
			});
		} catch (profileErr) {
			console.error('Profile create after register failed:', profileErr);
			try {
				await ensureFirestoreUser({
					uid: result.user.uid,
					email: result.user.email,
					displayName: `${first_name || ''} ${last_name || ''}`.trim()
				});
			} catch (retryErr) {
				console.error('Profile retry after register failed:', retryErr);
			}
		}

		return result.user;
	},

	async logout() {
		await signOut(firebaseAuth);
	}
};
