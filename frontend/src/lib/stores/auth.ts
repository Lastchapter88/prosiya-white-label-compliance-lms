import { writable } from 'svelte/store';
import { auth as firebaseAuth, db } from '$lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { isAdminEmail, normalizeEmail, type PaymentStatus } from '$lib/config/admins';
import { ensureFirestoreUser } from '$lib/services/auth';

export interface AppUser extends Partial<User> {
	first_name?: string;
	last_name?: string;
	role?: string;
	avatar?: string;
	id?: string;
	paymentStatus?: PaymentStatus;
}

interface AuthState {
	isAuthenticated: boolean;
	user: AppUser | null;
	loading: boolean;
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	loading: true
};

function mapUser(firebaseUser: User, userData: Record<string, any> = {}): AppUser {
	const email = normalizeEmail(firebaseUser.email || userData.email || '');
	const shouldBeAdmin = isAdminEmail(email);
	return {
		id: firebaseUser.uid,
		uid: firebaseUser.uid,
		email: email || firebaseUser.email || '',
		displayName: firebaseUser.displayName,
		photoURL: firebaseUser.photoURL,
		first_name: userData.firstName || firebaseUser.displayName?.split(' ')[0] || '',
		last_name: userData.lastName || firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
		role: shouldBeAdmin ? 'admin' : userData.role || 'student',
		paymentStatus: userData.paymentStatus === 'paid' ? 'paid' : 'unpaid',
		avatar: userData.profile?.avatar || firebaseUser.photoURL || ''
	};
}

function createAuthStore() {
	const { subscribe, set } = writable<AuthState>(initialState);

	if (typeof window !== 'undefined') {
		onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
			if (firebaseUser) {
				// Mark signed-in immediately so protected routes cannot bounce
				// the user back to /login while the profile document loads.
				set({
					isAuthenticated: true,
					user: mapUser(firebaseUser),
					loading: false
				});

				try {
					const userDocRef = doc(db, 'users', firebaseUser.uid);
					let userDoc = await getDoc(userDocRef);

					if (!userDoc.exists()) {
						await ensureFirestoreUser(firebaseUser);
						userDoc = await getDoc(userDocRef);
					}

					const userData: Record<string, any> = userDoc.exists() ? userDoc.data() || {} : {};
					const email = normalizeEmail(firebaseUser.email || userData.email || '');

					if (userDoc.exists() && isAdminEmail(email) && userData.role !== 'admin') {
						await updateDoc(userDocRef, {
							role: 'admin',
							updatedAt: new Date().toISOString()
						});
						userData.role = 'admin';
					}

					set({
						isAuthenticated: true,
						user: mapUser(firebaseUser, userData),
						loading: false
					});
				} catch (error) {
					console.error('Error fetching user profile:', error);
					set({
						isAuthenticated: true,
						user: mapUser(firebaseUser),
						loading: false
					});
				}
			} else {
				set({
					isAuthenticated: false,
					user: null,
					loading: false
				});
			}
		});
	}

	return {
		subscribe,
		logout: async () => {
			set({
				isAuthenticated: false,
				user: null,
				loading: true
			});
			await signOut(firebaseAuth);
		}
	};
}

export const auth = createAuthStore();

export function isAppAdmin(user: AppUser | null | undefined): boolean {
	if (!user) return false;
	return user.role === 'admin' || isAdminEmail(user.email);
}

export function hasPaidAccess(user: AppUser | null | undefined): boolean {
	if (!user) return false;
	if (isAppAdmin(user)) return true;
	return user.paymentStatus === 'paid';
}
