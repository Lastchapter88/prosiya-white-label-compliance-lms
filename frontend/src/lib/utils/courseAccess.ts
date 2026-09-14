import type { AppUser } from '$lib/stores/auth';
import { isAppAdmin } from '$lib/stores/auth';
import type { MaterialAccessStatus } from '$lib/services/studyMaterial';

export type CourseAccessStatus = MaterialAccessStatus | 'none';

export function resolveCourseAccess(params: {
	accessStatus?: CourseAccessStatus | null;
	legacyPaid?: boolean;
}): CourseAccessStatus {
	if (params.accessStatus === 'approved' || params.accessStatus === 'pending' || params.accessStatus === 'denied') {
		return params.accessStatus;
	}
	return params.legacyPaid ? 'approved' : 'pending';
}

export function hasCourseAccess(
	user: AppUser | null | undefined,
	accessStatus?: CourseAccessStatus | null
): boolean {
	if (!user) return false;
	if (isAppAdmin(user)) return true;
	return accessStatus === 'approved';
}

export function accessStatusLabel(status?: CourseAccessStatus | null): string {
	if (status === 'approved') return 'Access granted';
	if (status === 'denied') return 'Application declined';
	if (status === 'pending') return 'Application pending';
	return 'Not applied';
}
