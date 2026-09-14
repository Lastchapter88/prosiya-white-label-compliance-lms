import { db } from '$lib/firebase';
import {
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where
} from 'firebase/firestore';
import { courseCatalogue } from '$lib/data/courses';
import {
	studyMaterialService,
	type MaterialAccessStatus,
	type StudyMaterial
} from '$lib/services/studyMaterial';
import { resolveCourseAccess, type CourseAccessStatus } from '$lib/utils/courseAccess';

export interface LearnerCourse {
	id: string;
	courseSlug: string;
	courseTitle: string;
	shortDescription: string;
	category: string;
	image: string;
	progress: number;
	enrolledAt: string;
	materials: StudyMaterial[];
	accessStatus: CourseAccessStatus;
}

export type { CourseAccessStatus, MaterialAccessStatus };

function catalogueMatch(slug: string) {
	return courseCatalogue.find((course) => course.slug === slug);
}

function enrollmentDocId(userId: string, courseSlug: string) {
	return `${userId}_${courseSlug}`;
}

export const enrollmentService = {
	async enroll(params: {
		userId: string;
		userEmail: string;
		userName: string;
		courseSlug: string;
		courseTitle: string;
	}): Promise<void> {
		const id = enrollmentDocId(params.userId, params.courseSlug);
		await setDoc(
			doc(db, 'enrollments', id),
			{
				userId: params.userId,
				courseSlug: params.courseSlug,
				courseTitle: params.courseTitle,
				status: 'pending',
				progress: 0,
				enrolledAt: new Date().toISOString()
			},
			{ merge: true }
		);

		await studyMaterialService.requestAccess({
			userId: params.userId,
			userEmail: params.userEmail,
			userName: params.userName,
			courseSlug: params.courseSlug,
			courseTitle: params.courseTitle
		});
	},

	async getMyCourses(userId: string, legacyPaid = false): Promise<LearnerCourse[]> {
		const enrollQuery = query(collection(db, 'enrollments'), where('userId', '==', userId));
		const [enrollSnap, accessRecords, allMaterials] = await Promise.all([
			getDocs(enrollQuery),
			studyMaterialService.getMyAccessRequests(userId),
			studyMaterialService.getAllMaterials().catch(() => [] as StudyMaterial[])
		]);

		const accessBySlug = new Map(accessRecords.map((record) => [record.courseSlug, record]));
		const bySlug = new Map<
			string,
			{ courseTitle: string; enrolledAt: string; progress: number }
		>();

		for (const record of enrollSnap.docs) {
			const data = record.data();
			bySlug.set(data.courseSlug, {
				courseTitle: data.courseTitle || data.courseSlug,
				enrolledAt: data.enrolledAt || '',
				progress: Number(data.progress || 0)
			});
		}

		for (const access of accessRecords) {
			if (!bySlug.has(access.courseSlug)) {
				bySlug.set(access.courseSlug, {
					courseTitle: access.courseTitle || access.courseSlug,
					enrolledAt: access.requestedAt || '',
					progress: 0
				});
			}
		}

		const materialsByCourse = new Map<string, StudyMaterial[]>();
		for (const material of allMaterials) {
			const list = materialsByCourse.get(material.courseSlug) || [];
			list.push(material);
			materialsByCourse.set(material.courseSlug, list);
		}

		return [...bySlug.keys()]
			.map((courseSlug) => {
				const course = catalogueMatch(courseSlug);
				const enrollment = bySlug.get(courseSlug);
				const accessStatus = resolveCourseAccess({
					accessStatus: accessBySlug.get(courseSlug)?.status,
					legacyPaid
				});
				const materials =
					accessStatus === 'approved'
						? (materialsByCourse.get(courseSlug) || []).sort((a, b) => a.order - b.order)
						: [];
				return {
					id: enrollmentDocId(userId, courseSlug),
					courseSlug,
					courseTitle: course?.title || enrollment?.courseTitle || courseSlug,
					shortDescription: course?.short_description || '',
					category: course?.category || 'Training',
					image: course?.image || '/images/courses/firearm-training.png',
					progress: accessStatus === 'approved' ? enrollment?.progress || 0 : 0,
					enrolledAt: enrollment?.enrolledAt || '',
					materials,
					accessStatus
				};
			})
			.sort((a, b) => {
				const order = new Map<string, number>(
					courseCatalogue.map((course, index) => [course.slug, index])
				);
				return (order.get(a.courseSlug) ?? 999) - (order.get(b.courseSlug) ?? 999);
			});
	}
};
