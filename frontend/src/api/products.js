import api from './index';

export const productAPI = {
    getFeaturedProducts: async () => {
        try {
            console.log('Making featured products API call...');
            const response = await api.get('/products/featured/');
            
            // Add validation
            if (!response.data) {
                throw new Error('No data received from API');
            }
            
            console.log('API Response:', {
                status: response.status,
                headers: response.headers,
                data: response.data
            });
            
            return response;
        } catch (error) {
            console.error('Featured Products Error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                stack: error.stack
            });
            throw error;
        }
    },
    
    getAllProducts: async () => {
        try {
            const response = await api.get('/products/');
            return response;
        } catch (error) {
            console.error('Error in getAllProducts:', error);
            throw error;
        }
    },
    
    getProductsByCategory: async (category) => {
        try {
            const response = await api.get(`/products/category/${category}/`);
            return response.data;
        } catch (error) {
            console.error('Error in getProductsByCategory:', error);
            throw error;
        }
    },
    
    searchProducts: async (query) => {
        try {
            const response = await api.get(`/products/search/?q=${query}`);
            return response;
        } catch (error) {
            console.error('Error in searchProducts:', error);
            throw error;
        }
    }
};