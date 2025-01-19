import api from './index';

export const productAPI = {
    getFeaturedProducts: async () => {
        try {
            const response = await api.get('/products/featured/');
            return response;
        } catch (error) {
            console.error('Error fetching featured products:', error);
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