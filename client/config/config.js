const config = {
    SERVER_URL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5110',
    CLIENT_URL: import.meta.env.VITE_CLIENT_URL || 'http://localhost:5112',
    PORT: import.meta.env.VITE_PORT || '5112',
    API_ENDPOINTS: {
        LOGIN: '/api/login',
        REGISTER: '/api/register',
        SEND_OTP: '/api/send-otp',
        VERIFY_OTP: '/api/verify-otp',
        VERIFY_EMAIL: '/api/verify-email'
    }
};

export default config;