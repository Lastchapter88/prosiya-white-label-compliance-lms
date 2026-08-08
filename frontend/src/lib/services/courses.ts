import { api } from './api';

export const courseService = {
    async getCourses() {
        return await api.get('/courses/list/');
    },

    async getCourse(slug: string) {
        return await api.get(`/courses/list/${slug}/`);
    },

    async createCourse(data: any) {
        return await api.post('/courses/list/', data);
    },

    async updateCourse(slug: string, data: any) {
        return await api.patch(`/courses/list/${slug}/`, data);
    },

    async deleteCourse(slug: string) {
        return await api.delete(`/courses/list/${slug}/`);
    },

    async enroll(courseId: string) {
        return await api.post(`/courses/list/${courseId}/enroll/`, {});
    },

    async getMyEnrollments() {
        return await api.get('/courses/enrollments/');
    },

    async getLesson(lessonId: string) {
        return await api.get(`/courses/lessons/${lessonId}/`);
    },

    async createLesson(data: any) {
        return await api.post('/courses/lessons/', data);
    },

    async updateLesson(id: string, data: any) {
        return await api.patch(`/courses/lessons/${id}/`, data);
    },

    async deleteLesson(id: string) {
        return await api.delete(`/courses/lessons/${id}/`);
    },

    async completeLesson(lessonId: string) {
        return await api.post(`/courses/lessons/${lessonId}/complete/`, {});
    },

    // Modules
    async createModule(data: any) {
        return await api.post('/courses/modules/', data);
    },

    async updateModule(id: string, data: any) {
        return await api.patch(`/courses/modules/${id}/`, data);
    },

    async deleteModule(id: string) {
        return await api.delete(`/courses/modules/${id}/`);
    }
};
