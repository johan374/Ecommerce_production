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

// Add the logging here, right after api creation
console.log('API Configuration:', {
    baseURL: api.defaults.baseURL,
    mediaURL: MEDIA_URL
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
                            data[key] = data[key].map(img => {
                                if (!img) return "/api/placeholder/400/320";
                                try {
                                    const url = img.startsWith('http') ? img : 
                                        `${MEDIA_URL}${img.startsWith('/') ? img : '/' + img}`;
                                    // For debugging
                                    console.log('Processed image URL:', url);
                                    return url;
                                } catch (e) {
                                    console.error('Error processing image URL:', e);
                                    return "/api/placeholder/400/320";
                                }
                            });
                        } else if (typeof data[key] === 'string' && data[key]) {
                            try {
                                data[key] = data[key].startsWith('http') ? data[key] :
                                    `${MEDIA_URL}${data[key].startsWith('/') ? data[key] : '/' + data[key]}`;
                                // For debugging
                                console.log('Processed single image URL:', data[key]);
                            } catch (e) {
                                console.error('Error processing single image URL:', e);
                                data[key] = "/api/placeholder/400/320";
                            }
                        } else {
                            data[key] = "/api/placeholder/400/320";
                        }
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