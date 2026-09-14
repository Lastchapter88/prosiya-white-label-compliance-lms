import { get } from 'svelte/store';
import { auth, isAppAdmin, type AppUser } from '$lib/stores/auth';

export function safeRedirectPath(preferred?: string | null): string | null {
	if (!preferred) return null;
	if (!preferred.startsWith('/') || preferred.startsWith('//') || preferred.includes('\\')) {
		return null;
	}
	return preferred;
}

export function defaultPostAuthPath(user: AppUser | null | undefined, preferred?: string | null): string {
	const safe = safeRedirectPath(preferred);
	if (safe) return safe;
	if (isAppAdmin(user)) return '/admin/dashboard';
	if (user?.role === 'instructor') return '/instructor/dashboard';
	return '/student/dashboard';
}

export function waitForAuthUser(timeoutMs = 20000): Promise<AppUser> {
	const current = get(auth);
	if (current.isAuthenticated && current.user?.id) {
		return Promise.resolve(current.user);
	}

	return new Promise((resolve, reject) => {
		let unsub = () => {};
		const timeout = setTimeout(() => {
			unsub();
			reject(new Error('Your session is taking too long to load. Please try signing in again.'));
		}, timeoutMs);

		unsub = auth.subscribe((state) => {
			if (state.isAuthenticated && state.user?.id) {
				clearTimeout(timeout);
				unsub();
				resolve(state.user);
			}
		});
	});
}
