import { db, storage } from '$lib/firebase';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	updateDoc,
	where,
	orderBy
} from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

export type MaterialAccessStatus = 'pending' | 'approved' | 'denied';

export interface StudyMaterial {
	id: string;
	courseSlug: string;
	courseTitle: string;
	title: string;
	grade?: string;
	fileName: string;
	storagePath: string;
	order: number;
}

export function materialSubtitle(material: StudyMaterial): string {
	const parts = [
		material.grade ? `Grade ${material.grade}` : null,
		material.fileName
	].filter(Boolean);
	return parts.join(' · ');
}

export interface MaterialAccess {
	id: string;
	userId: string;
	userEmail: string;
	userName: string;
	courseSlug: string;
	courseTitle: string;
	status: MaterialAccessStatus;
	requestedAt: string;
	reviewedAt?: string;
	reviewedBy?: string;
	adminNotes?: string;
}

function accessDocId(userId: string, courseSlug: string) {
	return `${userId}_${courseSlug}`;
}

export const studyMaterialService = {
	async getMaterialsForCourse(courseSlug: string): Promise<StudyMaterial[]> {
		const q = query(
			collection(db, 'study_materials'),
			where('courseSlug', '==', courseSlug),
			orderBy('order')
		);
		const snap = await getDocs(q);
		return snap.docs.map((d) => ({ id: d.id, ...d.data() } as StudyMaterial));
	},

	async getAllMaterials(): Promise<StudyMaterial[]> {
		const q = query(collection(db, 'study_materials'), orderBy('order'));
		const snap = await getDocs(q);
		return snap.docs.map((d) => ({ id: d.id, ...d.data() } as StudyMaterial));
	},

	async getAccess(userId: string, courseSlug: string): Promise<MaterialAccess | null> {
		const docRef = doc(db, 'material_access', accessDocId(userId, courseSlug));
		try {
			const snap = await getDoc(docRef);
			if (!snap.exists()) return null;
			return { id: snap.id, ...snap.data() } as MaterialAccess;
		} catch (error: any) {
			if (error?.code === 'permission-denied') return null;
			throw error;
		}
	},

	async getMyAccessRequests(userId: string): Promise<MaterialAccess[]> {
		const q = query(collection(db, 'material_access'), where('userId', '==', userId));
		const snap = await getDocs(q);
		return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MaterialAccess));
	},

	async requestAccess(params: {
		userId: string;
		userEmail: string;
		userName: string;
		courseSlug: string;
		courseTitle: string;
	}): Promise<MaterialAccess> {
		const id = accessDocId(params.userId, params.courseSlug);
		const existing = await this.getAccess(params.userId, params.courseSlug);
		if (existing?.status === 'approved' || existing?.status === 'pending') {
			return existing;
		}

		const record: Omit<MaterialAccess, 'id'> = {
			userId: params.userId,
			userEmail: params.userEmail,
			userName: params.userName,
			courseSlug: params.courseSlug,
			courseTitle: params.courseTitle,
			status: 'pending',
			requestedAt: new Date().toISOString()
		};

		await setDoc(doc(db, 'material_access', id), record, { merge: true });
		return { id, ...record };
	},

	async listAccessForUser(userId: string): Promise<MaterialAccess[]> {
		return this.getMyAccessRequests(userId);
	},

	async approveAllPendingForUser(userId: string, adminUid: string) {
		const records = await this.getMyAccessRequests(userId);
		const pending = records.filter((record) => record.status === 'pending');
		await Promise.all(pending.map((record) => this.approveAccess(record.id, adminUid)));
		return pending.length;
	},

	async listPendingAccess(): Promise<MaterialAccess[]> {
		const q = query(
			collection(db, 'material_access'),
			where('status', '==', 'pending'),
			orderBy('requestedAt')
		);
		const snap = await getDocs(q);
		return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MaterialAccess));
	},

	async listAllAccess(): Promise<MaterialAccess[]> {
		const q = query(collection(db, 'material_access'), orderBy('requestedAt', 'desc'));
		const snap = await getDocs(q);
		return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MaterialAccess));
	},

	async approveAccess(accessId: string, adminUid: string, adminNotes = '') {
		await updateDoc(doc(db, 'material_access', accessId), {
			status: 'approved',
			reviewedAt: new Date().toISOString(),
			reviewedBy: adminUid,
			adminNotes
		});
	},

	async denyAccess(accessId: string, adminUid: string, adminNotes = '') {
		await updateDoc(doc(db, 'material_access', accessId), {
			status: 'denied',
			reviewedAt: new Date().toISOString(),
			reviewedBy: adminUid,
			adminNotes
		});
	},

	async getDownloadUrl(storagePath: string): Promise<string> {
		return getDownloadURL(ref(storage, storagePath));
	}
};
