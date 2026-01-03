import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const api = {
    checkHealth: async () => {
        try {
            const response = await axios.get(`${API_URL}/health`);
            return response.data;
        } catch (error) {
            console.error("Backend health check failed:", error);
            return null;
        }
    },

    predictDiabetes: async (data) => {
        try {
            const response = await axios.post(`${API_URL}/predict/diabetes`, data);
            return response.data;
        } catch (error) {
            console.error("Diabetes prediction error:", error);
            throw error;
        }
    },

    predictHeart: async (data) => {
        try {
            const response = await axios.post(`${API_URL}/predict/heart`, data);
            return response.data;
        } catch (error) {
            console.error("Heart prediction error:", error);
            throw error;
        }
    }
};
