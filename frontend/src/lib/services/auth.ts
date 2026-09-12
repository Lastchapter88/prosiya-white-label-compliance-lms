import { auth as firebaseAuth, db } from '$lib/firebase';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	updateProfile,
	GoogleAuthProvider,
	signInWithRedirect,
	getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { isAdminEmail, normalizeEmail } from '$lib/config/admins';

const GOOGLE_REDIRECT_KEY = 'prosiya_google_redirect';

async function ensureFirestoreUser(user: any) {
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
	} else if (isAdminEmail(email) && userSnap.data().role !== 'admin') {
		await updateDoc(userRef, {
			role: 'admin',
			updatedAt: new Date().toISOString()
		});
	}
}

export const authService = {
	async login(credentials: any) {
		const { email, password } = credentials;
		const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
		try {
			await ensureFirestoreUser(result.user);
		} catch (profileErr) {
			console.error('Profile sync after login failed:', profileErr);
		}
		return result.user;
	},

	loginWithGoogle(redirectUrl?: string) {
		if (typeof window !== 'undefined' && redirectUrl) {
			sessionStorage.setItem(GOOGLE_REDIRECT_KEY, redirectUrl);
		}
		const provider = new GoogleAuthProvider();
		return signInWithRedirect(firebaseAuth, provider);
	},

	async handleGoogleRedirect(): Promise<{ user?: any; redirectUrl?: string; error?: string }> {
		const storedRedirect = typeof window !== 'undefined' ? sessionStorage.getItem(GOOGLE_REDIRECT_KEY) : null;
		try {
			const result = await getRedirectResult(firebaseAuth);
			if (result?.user) {
				try {
					await ensureFirestoreUser(result.user);
				} catch (profileErr) {
					console.error('Profile sync after Google sign-in failed:', profileErr);
				}
				return { user: result.user, redirectUrl: storedRedirect || undefined };
			}
			return {};
		} catch (err: any) {
			const msg = err?.message || 'Google sign-in failed';
			return { error: msg };
		} finally {
			if (typeof window !== 'undefined') {
				sessionStorage.removeItem(GOOGLE_REDIRECT_KEY);
			}
		}
	},

	async register(userData: any) {
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
			// Auth account already exists — do not fail registration for profile write issues.
			console.error('Profile create after register failed:', profileErr);
			try {
				await ensureFirestoreUser({
					...result.user,
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
