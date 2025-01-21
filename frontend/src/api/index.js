import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-backend-nhrc.onrender.com/api';
const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || 'https://ecommerce-backend-nhrc.onrender.com';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://ecommerce-backend-nhrc.onrender.com/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: false
});

// Add an interceptor to handle image URLs
api.interceptors.response.use(
    response => {
        // Modify image URLs to be absolute
        // In index.js
        const processImageUrls = (data) => {
            if (typeof data === 'object' && data !== null) {
                Object.keys(data).forEach(key => {
                    if (key === 'image_url' || key === 'additional_images') {
                        if (Array.isArray(data[key])) {
                            data[key] = data[key].map(img => 
                                img ? (img.startsWith('http') ? img : 
                                `${MEDIA_URL}${img.startsWith('/') ? img : '/' + img}`)
                                : "/api/placeholder/400/320"
                            );
                        } else if (typeof data[key] === 'string' && data[key]) {
                            data[key] = data[key].startsWith('http') ? data[key] :
                                `${MEDIA_URL}${data[key].startsWith('/') ? data[key] : '/' + data[key]}`;
                        } else {
                            data[key] = "/api/placeholder/400/320";
                        }
                    } else if (typeof data[key] === 'object') {
                        processImageUrls(data[key]);
                    }
                });
            }
            return data;
        };

        response.data = processImageUrls(response.data);
        return response;
    },
    error => Promise.reject(error)
);

export default api;