/** ProSiya admin accounts — only these emails may access the admin panel. */
export const ADMIN_EMAILS = [
	'luckysekhula@gmail.com',
	'dladla.siya@gmail.com'
] as const;

export type PaymentStatus = 'paid' | 'unpaid';

export function isAdminEmail(email: string | null | undefined): boolean {
	if (!email) return false;
	return ADMIN_EMAILS.includes(email.toLowerCase().trim() as (typeof ADMIN_EMAILS)[number]);
}

export function normalizeEmail(email: string): string {
	return email.toLowerCase().trim();
}
