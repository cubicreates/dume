import config from '../config/config.js';

export const makeApiCall = async (endpoint, method = 'GET', body = null) => {
    try {
        const response = await fetch(`${config.SERVER_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API call failed');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const login = (credentials) => 
    makeApiCall(config.API_ENDPOINTS.LOGIN, 'POST', credentials);

export const sendOtp = (email) => 
    makeApiCall(config.API_ENDPOINTS.SEND_OTP, 'POST', { email });

export const verifyOtp = (email, otp) => 
    makeApiCall(config.API_ENDPOINTS.VERIFY_OTP, 'POST', { email, otp });

export const register = (userData) => 
    makeApiCall(config.API_ENDPOINTS.REGISTER, 'POST', userData);