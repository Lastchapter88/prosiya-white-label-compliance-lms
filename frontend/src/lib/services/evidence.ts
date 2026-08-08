import { api } from './api';

export const evidenceService = {
    async getEvidenceList(status?: string) {
        let url = '/evidence/firearm-evidence/';
        if (status) url += `?status=${status}`;
        return await api.get(url);
    },

    async getEvidenceDetail(id: string) {
        return await api.get(`/evidence/firearm-evidence/${id}/`);
    },

    async verifyEvidence(id: string, notes: string) {
        return await api.post(`/evidence/firearm-evidence/${id}/verify/`, { notes });
    },

    async addReview(evidenceId: string, reviewData: any) {
        return await api.post('/evidence/reviews/', {
            evidence: evidenceId,
            ...reviewData
        });
    }
};
