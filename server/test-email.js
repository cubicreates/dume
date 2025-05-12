import { sendVerificationEmail } from './utils/emailService.js';

const testUser = {
    _id: '123456789',
    email: 'blubrdpirts@gmail.com'  // Replace with your email
};

sendVerificationEmail(testUser)
    .then(() => console.log('Test email sent successfully'))
    .catch(error => console.error('Test failed:', error));