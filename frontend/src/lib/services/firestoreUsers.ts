import { db } from '$lib/firebase';
import {
	collection,
	doc,
	getDocs,
	orderBy,
	query,
	updateDoc,
	type DocumentData
} from 'firebase/firestore';
import type { PaymentStatus } from '$lib/config/admins';

export interface FirestoreUser {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	paymentStatus: PaymentStatus;
	createdAt: string;
	isActive: boolean;
	updatedAt?: string;
	paymentUpdatedAt?: string;
	paymentUpdatedBy?: string;
}

function mapUser(id: string, data: DocumentData): FirestoreUser {
	return {
		id,
		firstName: data.firstName || '',
		lastName: data.lastName || '',
		email: data.email || '',
		role: data.role || 'student',
		paymentStatus: data.paymentStatus === 'paid' ? 'paid' : 'unpaid',
		createdAt: data.createdAt || '',
		isActive: data.isActive !== false,
		updatedAt: data.updatedAt,
		paymentUpdatedAt: data.paymentUpdatedAt,
		paymentUpdatedBy: data.paymentUpdatedBy
	};
}

export const firestoreUserService = {
	async listRegisteredUsers(): Promise<FirestoreUser[]> {
		const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
		const snap = await getDocs(q);
		return snap.docs.map((d) => mapUser(d.id, d.data()));
	},

	async setPaymentStatus(
		userId: string,
		paymentStatus: PaymentStatus,
		adminUid: string
	): Promise<void> {
		await updateDoc(doc(db, 'users', userId), {
			paymentStatus,
			paymentUpdatedAt: new Date().toISOString(),
			paymentUpdatedBy: adminUid,
			updatedAt: new Date().toISOString()
		});
	}
};
