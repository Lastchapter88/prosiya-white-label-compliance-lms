import { writable } from 'svelte/store';
import { auth as firebaseAuth, db } from '$lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { isAdminEmail, normalizeEmail, type PaymentStatus } from '$lib/config/admins';

interface AppUser extends Partial<User> {
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

function createAuthStore() {
	const { subscribe, set } = writable<AuthState>(initialState);

	if (typeof window !== 'undefined') {
		onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
			if (firebaseUser) {
				try {
					const userDocRef = doc(db, 'users', firebaseUser.uid);
					const userDoc = await getDoc(userDocRef);

					let userData: any = {};
					if (userDoc.exists()) {
						userData = userDoc.data();
					}

					const email = normalizeEmail(firebaseUser.email || userData.email || '');
					const shouldBeAdmin = isAdminEmail(email);

					if (shouldBeAdmin && userData.role !== 'admin') {
						await updateDoc(userDocRef, {
							role: 'admin',
							updatedAt: new Date().toISOString()
						});
						userData.role = 'admin';
					}

					const appUser: AppUser = {
						...firebaseUser,
						id: firebaseUser.uid,
						first_name: userData.firstName || firebaseUser.displayName?.split(' ')[0] || '',
						last_name:
							userData.lastName || firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
						role: shouldBeAdmin ? 'admin' : userData.role || 'student',
						paymentStatus: userData.paymentStatus === 'paid' ? 'paid' : 'unpaid',
						avatar: userData.profile?.avatar || firebaseUser.photoURL || '',
						email: email || firebaseUser.email || ''
					};

					set({
						isAuthenticated: true,
						user: appUser,
						loading: false
					});
				} catch (error) {
					console.error('Error fetching user profile:', error);
					set({
						isAuthenticated: true,
						user: firebaseUser,
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
