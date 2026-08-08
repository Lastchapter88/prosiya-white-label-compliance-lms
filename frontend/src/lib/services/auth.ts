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
import { doc, setDoc, getDoc } from 'firebase/firestore';

const GOOGLE_REDIRECT_KEY = 'prosiya_google_redirect';

async function ensureFirestoreUser(user: any) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        const displayName = user.displayName || '';
        const parts = displayName.trim().split(/\s+/);
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';
        await setDoc(userRef, {
            firstName,
            lastName,
            email: user.email || '',
            role: 'student',
            createdAt: new Date().toISOString(),
            isActive: true,
            updatedAt: new Date().toISOString()
        });
    }
}

export const authService = {
    async login(credentials: any) {
        const { email, password } = credentials;
        const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
        return result.user;
    },

    /** Start Google sign-in: redirects to Google. After return, use handleGoogleRedirect() on the login page. */
    loginWithGoogle(redirectUrl?: string) {
        if (typeof window !== 'undefined' && redirectUrl) {
            sessionStorage.setItem(GOOGLE_REDIRECT_KEY, redirectUrl);
        }
        const provider = new GoogleAuthProvider();
        return signInWithRedirect(firebaseAuth, provider);
    },

    /** Call this on login page load to complete Google sign-in after redirect. Returns { user, redirectUrl } or { error }. */
    async handleGoogleRedirect(): Promise<{ user?: any; redirectUrl?: string; error?: string }> {
        const storedRedirect = typeof window !== 'undefined' ? sessionStorage.getItem(GOOGLE_REDIRECT_KEY) : null;
        try {
            const result = await getRedirectResult(firebaseAuth);
            if (result?.user) {
                await ensureFirestoreUser(result.user);
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
        const { email, password, first_name, last_name, role } = userData;
        
        // Create Authentication User
        const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        
        // Update Profile Display Name
        if (first_name && last_name) {
            await updateProfile(result.user, {
                displayName: `${first_name} ${last_name}`
            });
        }

        // Create Firestore User Document
        await setDoc(doc(db, "users", result.user.uid), {
            firstName: first_name,
            lastName: last_name,
            email: email,
            role: role || 'student',
            createdAt: new Date().toISOString(),
            isActive: true,
            updatedAt: new Date().toISOString()
        });
        
        return result.user;
    },

    async logout() {
        await signOut(firebaseAuth);
    }
};
