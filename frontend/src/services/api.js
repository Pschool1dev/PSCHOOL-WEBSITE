const API_URL = "https://pschool-backend.onrender.com/api";

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
        // Détecter si on envoie un FormData
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
                throw new Error('Non authentifié');
            }

            const data = await response.json();
            
            if (!response.ok) {
                // Conserver les détails de l'erreur
                const error = new Error(data.message || 'Erreur API');
                error.response = { data, status: response.status };
                throw error;
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: data instanceof FormData ? data : JSON.stringify(data)
        });
    },

    put(endpoint, data) {
        const isFormData = data instanceof FormData;
        
        // Pour Laravel, on utilise POST avec _method=PUT quand c'est du FormData
        if (isFormData) {
            // Cloner le FormData pour ne pas modifier l'original
            const formDataWithMethod = new FormData();
            for (let [key, value] of data.entries()) {
                formDataWithMethod.append(key, value);
            }
            formDataWithMethod.append('_method', 'PUT');
            
            return this.request(endpoint, {
                method: 'POST',
                body: formDataWithMethod
            });
        }
        
        // Pour le JSON standard
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
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
    }
};

export default api;