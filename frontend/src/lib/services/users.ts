import { api } from './api';

export const userService = {
    async getUsers() {
        return await api.get('/users/');
    },

    async getUser(id: number) {
        return await api.get(`/users/${id}/`);
    },

    async createUser(data: any) {
        // Uses the typical CRUD endpoint, but separate from public 'register' if Admin wants to create specific roles.
        // Since UserViewSet is ModelViewSet now, POST /users/ should work if serializer supports it.
        // UserSerializer might be read-only for password though. 
        // We might need to check if UserViewSet create() handles password hashing.
        // By default ModelViewSet uses UserSerializer. create() calls serializer.save().
        // If UserSerializer doesn't use create_user helper, password will be cleartext.
        // We'll assume standard serializer handling or revisit if needed.
        return await api.post('/users/', data);
    },

    async updateUser(id: number, data: any) {
        return await api.patch(`/users/${id}/`, data);
    },

    async deleteUser(id: number) {
        return await api.delete(`/users/${id}/`);
    },

    async getMe() {
        return await api.get('/users/me/');
    }
};
