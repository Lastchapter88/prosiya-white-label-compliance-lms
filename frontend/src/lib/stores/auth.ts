import { writable } from 'svelte/store';
import { auth as firebaseAuth, db } from '$lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AppUser extends Partial<User> {
    first_name?: string;
    last_name?: string;
    role?: string;
    avatar?: string;
    id?: string;
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

    // Initialize Firebase Auth listener
    if (typeof window !== 'undefined') {
        onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDocRef = doc(db, "users", firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    
                    let userData: any = {};
                    if (userDoc.exists()) {
                        userData = userDoc.data();
                    }

                    const appUser: AppUser = {
                        ...firebaseUser,
                        id: firebaseUser.uid,
                        first_name: userData.firstName || firebaseUser.displayName?.split(' ')[0] || '',
                        last_name: userData.lastName || firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                        role: userData.role || 'student',
                        avatar: userData.profile?.avatar || firebaseUser.photoURL || '',
                        email: firebaseUser.email || ''
                    };

                    set({
                        isAuthenticated: true,
                        user: appUser,
                        loading: false
                    });
                } catch (error) {
                    console.error("Error fetching user profile:", error);
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
