import express, { json } from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import User from './models/Users.js';
import Data from './models/Data.js';  // Add this import
import { verifyToken, generateToken } from './utils/jwtUtils.js';
import { sendVerificationEmail, sendOtpEmail } from './utils/emailService.js'; // Add this import
import cors from 'cors';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth.js';

const result = config();
if (result.error) {
    throw new Error('Error loading environment variables');
}

const app = express();
app.use(cors());
app.use(express.json());

// Use auth routes
app.use('/api', authRoutes);

// Add CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ Connection error:", err));

// Basic route to test
app.get('/', (req, res) => {
    res.send('Express + MongoDB is working!');
});

// Route to create a user
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Routes for Data collection
app.post('/data', async (req, res) => {
    try {
        const data = new Data(req.body);
        await data.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/data/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            isVerified: false
        });

        await user.save();

        // Send verification email
        await sendVerificationEmail(user);

        res.status(201).json({ 
            message: 'Registration successful. Please check your email for verification.' 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Registration failed' 
        });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({
            $or: [{ username }, { email: username }]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check verification
        if (!user.isVerified) {
            return res.status(401).json({ 
                message: 'Please verify your email before logging in' 
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.json({
            token,
            username: user.username,
            isVerified: user.isVerified
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
});

// Email verification endpoint
app.get('/api/verify-email', async (req, res) => {
    try {
        const { token } = req.query;
        
        if (!token) {
            console.log('No token provided');
            return res.redirect(`${process.env.CLIENT_URL}/verification-failed`);
        }

        const decoded = verifyToken(token);
        
        if (!decoded || !decoded.userId) {
            console.log('Invalid token:', decoded);
            return res.redirect(`${process.env.CLIENT_URL}/verification-failed`);
        }

        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { isVerified: true },
            { new: true }
        );

        if (!user) {
            console.log('User not found:', decoded.userId);
            return res.redirect(`${process.env.CLIENT_URL}/verification-failed`);
        }

        console.log('User verified successfully:', user._id);
        return res.redirect(`${process.env.CLIENT_URL}/verification-success`);

    } catch (error) {
        console.error('Verification error:', error);
        return res.redirect(`${process.env.CLIENT_URL}/verification-failed`);
    }
});

// Add this new endpoint for email OTP
app.post('/api/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ 
                message: 'You are not registered. Please Register!' 
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in user document with expiry
        user.emailOtp = {
            code: otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
        };
        await user.save();

        // Send OTP email
        await sendOtpEmail(user.email, otp);

        res.json({ 
            message: 'OTP sent successfully',
            email: user.email 
        });

    } catch (error) {
        console.error('OTP error:', error);
        res.status(500).json({ 
            message: 'Failed to send OTP' 
        });
    }
});

app.post('/api/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        // Check if OTP exists and hasn't expired
        if (!user.emailOtp || !user.emailOtp.code || !user.emailOtp.expiresAt) {
            return res.status(400).json({ 
                message: 'No OTP found. Please request a new one.' 
            });
        }

        // Check if OTP has expired
        if (new Date() > user.emailOtp.expiresAt) {
            // Clear expired OTP
            user.emailOtp = undefined;
            await user.save();
            
            return res.status(400).json({ 
                message: 'OTP has expired. Please request a new one.' 
            });
        }

        // Verify OTP
        if (user.emailOtp.code !== otp) {
            return res.status(400).json({ 
                message: 'Invalid OTP' 
            });
        }

        // Clear OTP after successful verification
        user.emailOtp = undefined;
        await user.save();

        // Generate JWT token
        const token = generateToken(user._id);

        res.json({
            message: 'OTP verified successfully',
            token,
            username: user.username
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ 
            message: 'Failed to verify OTP' 
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
