import { api } from './api';

export const auditService = {
    async getAuditLogs() {
        return await api.get('/audit/logs/');
    },

    async getComplianceEvents() {
        return await api.get('/audit/events/');
    },

    async getDataExports() {
        return await api.get('/audit/exports/');
    },

    async createDataExport(exportType: string) {
        return await api.post('/audit/exports/', { export_type: exportType });
    }
};

export const certificateService = {
    async getCertificates() {
        return await api.get('/certificates/list/');
    },

    async getTemplates() {
        return await api.get('/certificates/templates/');
    },

    async issueCertificate(data: any) {
        return await api.post('/certificates/list/', data);
    },

    async revokeCertificate(id: string, reason: string) {
        return await api.post(`/certificates/list/${id}/revoke/`, { reason });
    }
};
