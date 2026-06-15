const API_URL = 'http://127.0.0.1:8000/api';

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
        const isFormData = options.body instanceof FormData;
        
        const headers = {
            'Accept': 'application/json',
            ...options.headers,
        };
        
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }

            // 🔥 SI C'EST UN BLOB, RETOURNE LA RÉPONSE DIRECTEMENT
            if (options.responseType === 'blob') {
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
                return response;
            }

            const data = await response.json();
            if (!response.ok) throw data;
            return data;
        } catch (error) {
            throw error;
        }
    },

    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: data instanceof FormData ? data : JSON.stringify(data)
        });
    },

    put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: data instanceof FormData ? data : JSON.stringify(data)
        });
    },

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    },

    // Méthodes de compatibilité
    login(identifier, password) {
        return this.post('/login', { identifier, password });
    },

    register(userData) {
        return this.post('/register', userData);
    },

    getUser() {
        return this.get('/user');
    },

    logout() {
        return this.post('/logout');
    },
    
    initiateCinetPay(amount, email) {
        return this.post('/v1/payment/initiate', { amount, email });
    }
};

export default api;