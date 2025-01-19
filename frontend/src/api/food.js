import api from './index';

export const foodAPI = {
    getAllFood: async (page = 1) => {
        try {
            const response = await api.get('/products/category/FOOD/', { 
                params: { page } 
            });
            return response;
        } catch (error) {
            console.error('Error fetching food data:', error);
            throw error;
        }
    },
    
    searchFood: async (query, page = 1) => {
        try {
            const response = await api.get('/products/search/', {
                params: {
                    q: query,
                    category: 'FOOD',
                    page: page
                }
            });
            return response;
        } catch (error) {
            console.error('Error searching food:', error);
            throw error;
        }
    },
    
    getFoodByCategory: async (subcategory, page = 1) => {
        try {
            console.log('Fetching food subcategory:', subcategory);
            
            // If category is 'all', use the regular food endpoint
            if (subcategory === 'all') {
                return await foodAPI.getAllFood(page);
            }

            // Map the frontend subcategory IDs to the backend slugs
            const slugMap = {
                'groceries': 'groceries',
                'prepared-meals': 'prepared-meals',
                'snacks-beverages': 'snacks-beverages'
            };

            const slug = slugMap[subcategory];
            console.log('Using slug:', slug); // Debug log

            if (!slug) {
                throw new Error('Invalid subcategory');
            }

            const response = await api.get('/products/category/FOOD/', {
                params: {
                    page: page,
                    slug: slug
                }
            });

            console.log('Food subcategory response:', response.data);
            return response;
        } catch (error) {
            console.error(`Error fetching food for subcategory ${subcategory}:`, error);
            throw error;
        }
    }
};

export default foodAPI;