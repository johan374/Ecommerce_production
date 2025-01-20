import api from './index';

export const productAPI = {
    getFeaturedProducts: async () => {
        try {
            const response = await api.get('/products/featured/');
            console.log('Raw Featured Products Response:', response);
            console.log('Response Data:', response.data);
            return response;
        } catch (error) {
            console.error('Detailed Featured Products Error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
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