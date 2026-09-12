/** Map Firebase Auth error codes to clear user-facing messages. */
export function friendlyAuthError(err: any): string {
	const code = String(err?.code || '');
	const message = String(err?.message || '');

	if (
		code === 'auth/configuration-not-found' ||
		message.includes('CONFIGURATION_NOT_FOUND')
	) {
		return 'Sign-in is temporarily unavailable. Please try again shortly, or contact ProSiya for help.';
	}
	if (code === 'auth/email-already-in-use') {
		return 'An account with this email already exists. Please sign in instead.';
	}
	if (code === 'auth/invalid-email') {
		return 'Please enter a valid email address.';
	}
	if (code === 'auth/weak-password') {
		return 'Password is too weak. Use at least 6 characters.';
	}
	if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
		return 'Invalid email or password. Please try again.';
	}
	if (code === 'auth/too-many-requests') {
		return 'Too many attempts. Please wait a moment and try again.';
	}
	if (code === 'auth/network-request-failed') {
		return 'Network error. Check your connection and try again.';
	}
	if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
		return 'Google sign-in was cancelled.';
	}
	if (code === 'auth/unauthorized-domain') {
		return 'This domain is not authorised for sign-in. Please use the official ProSiya website.';
	}
	if (message && !message.includes('Firebase:') && message.length < 180) {
		return message;
	}
	return 'Authentication failed. Please try again.';
}
