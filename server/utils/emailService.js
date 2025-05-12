import nodemailer from 'nodemailer';
import { generateToken } from './jwtUtils.js';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter with more detailed options
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: 'uni.guide.in@gmail.com',
        pass: 'nfcwrmzdtxrewyfx'
    },
    tls: {
        rejectUnauthorized: false // For testing only, remove in production
    },
});

// Test the connection immediately
transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP Connection Error:', error);
        console.error('Error Details:', {
            code: error.code,
            command: error.command,
            response: error.response
        });
    } else {
        console.log('SMTP Server is ready to send emails');
    }
});

export const sendVerificationEmail = async (user) => {
    try {
        console.log('Generating token for user:', user._id);
        const token = generateToken(user._id);
        const verificationLink = `${process.env.SERVER_URL}/api/verify-email?token=${token}`;

        console.log('Verification link:', verificationLink);

        const mailOptions = {
            from: {
                name: 'UniGUIDE Support',
                address: 'uni.guide.in@gmail.com'
            },
            to: user.email,
            subject: 'Verify your UniGUIDE account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #007bff;">Welcome to UniGUIDE!</h1>
                    <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationLink}" 
                           style="background-color: #007bff; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Verify Email
                        </a>
                    </div>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create an account with UniGUIDE, please ignore this email.</p>
                    <hr style="margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
                </div>
            `,
            text: `Welcome to UniGUIDE! Please verify your email by clicking this link: ${verificationLink}`
        };

        console.log('Sending mail with options:', {
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', {
            messageId: info.messageId,
            response: info.response,
            accepted: info.accepted,
            rejected: info.rejected
        });
        return true;
    } catch (error) {
        console.error('Email error:', error);
        throw error;
    }
};

export const sendOtpEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: {
                name: 'UniGUIDE Support',
                address: 'uni.guide.in@gmail.com'
            },
            to: email,
            subject: 'Your UniGUIDE Login OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #007bff;">UniGUIDE Login OTP</h1>
                    <p>Your OTP for login is:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; 
                                  background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                            ${otp}
                        </div>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this OTP, please ignore this email.</p>
                    <hr style="margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('OTP Email error:', error);
        throw error;
    }
};