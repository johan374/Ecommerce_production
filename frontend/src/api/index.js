import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-backend-nhrc.onrender.com/api';
const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || 'https://ecommerce-backend-nhrc.onrender.com';

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: false
});

// Add a request interceptor to modify image URLs if needed
// In your API interceptor
api.interceptors.response.use(
    response => {
        // Modify image URLs to be absolute if they're relative
        const processResponse = (data) => {
            if (typeof data === 'object' && data !== null) {
                Object.keys(data).forEach(key => {
                    if (key === 'image_url' && data[key] && !data[key].startsWith('http')) {
                        data[key] = `https://ecommerce-backend-nhrc.onrender.com${data[key].startsWith('/') ? data[key] : '/' + data[key]}`;
                    } else if (typeof data[key] === 'object') {
                        processResponse(data[key]);
                    }
                });
            }
            return data;
        };

        response.data = processResponse(response.data);
        return response;
    },
    error => Promise.reject(error)
);

export default api;