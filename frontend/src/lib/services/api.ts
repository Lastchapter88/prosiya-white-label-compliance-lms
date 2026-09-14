import { auth } from '$lib/stores/auth';
import { get } from 'svelte/store';

const BASE_URL = 'http://127.0.0.1:8000/api';

class ApiClient {
    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${BASE_URL}${endpoint}`;
        const headers = new Headers(options.headers);
        
        // Add auth token if available
        const token = (get(auth) as { token?: string }).token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        
        headers.set('Content-Type', 'application/json');
        
        const config = {
            ...options,
            headers
        };
        
        try {
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                throw new Error('Session expired');
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || errorData.message || 'API Request Failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    get(endpoint: string) {
        return this.request(endpoint, { method: 'GET' });
    }
    
    post(endpoint: string, body: any) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }
    
    put(endpoint: string, body: any) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    patch(endpoint: string, body: any) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    }
    
    delete(endpoint: string) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiClient();
