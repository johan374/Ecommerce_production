import axios from 'axios';

// Create a separate Axios instance for payments with Render URL
const paymentApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL.replace('/api', ''), // Remove '/api' since it's included in the routes
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// In payment.js
export const paymentAPI = {
    createOrder: async (items) => {
        try {
            const response = await paymentApi.post('/api/orders/create/', {
                items: items
            });
            return response;
        } catch (error) {
            console.error('Detailed error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },
    
    processPayment: async (paymentIntentId, paymentMethodId) => {
        try {
            const response = await paymentApi.post('/api/process/', {
                payment_intent_id: paymentIntentId,
                payment_method_id: paymentMethodId
            });
            return response;
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    }
};

export default paymentAPI;