import api from './index';

export const electronicsAPI = {
    getAllElectronics: async (page = 1) => {
        try {
            const response = await api.get('/products/category/ELEC/', { 
                params: { page } 
            });
            return response;
        } catch (error) {
            console.error('Error fetching electronics data:', error);
            throw error;
        }
    },
    
    searchElectronics: async (query, page = 1) => {
        try {
            const response = await api.get('/products/search/', {
                params: {
                    q: query,
                    category: 'ELEC',
                    page: page
                }
            });
            return response;
        } catch (error) {
            console.error('Error searching electronics:', error);
            throw error;
        }
    },
    
    getElectronicsBySubcategory: async (subcategory, page = 1) => {
        try {
            console.log('Fetching subcategory:', subcategory);
            
            // If category is 'all', use the regular electronics endpoint
            if (subcategory === 'all') {
                return await electronicsAPI.getAllElectronics(page);
            }

            // Map the frontend subcategory IDs to the backend slugs
            const slugMap = {
                'tv-home-theater': 'tv-home-theater',
                'computers-smartphones': 'computers-smartphones',
                'home-tools': 'home-tools'
            };

            const slug = slugMap[subcategory];
            console.log('Using slug:', slug); // Debug log

            if (!slug) {
                throw new Error('Invalid subcategory');
            }

            const response = await api.get('/products/category/ELEC/', {
                params: {
                    page: page,
                    slug: slug
                }
            });

            console.log('Subcategory response:', response.data);
            return response;
        } catch (error) {
            console.error(`Error fetching electronics for subcategory ${subcategory}:`, error);
            throw error;
        }
    }
};

export default electronicsAPI;