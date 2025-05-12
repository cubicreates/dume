import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isContributor: {
        type: Boolean,
        default: false
    },
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    followed_fields: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Field' }],
        default: [],
        validate: {
            validator: Array.isArray,
            message: 'Followed fields must be an array'
        }
    },
    followed_courses: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        default: [],
        validate: {
            validator: Array.isArray,
            message: 'Followed courses must be an array'
        }
    },
    followed_subjects: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
        default: [],
        validate: {
            validator: Array.isArray,
            message: 'Followed subjects must be an array'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },
    emailOtp: {
        code: String,
        expiresAt: Date
    }
});

// Add a method to check OTP validity
userSchema.methods.isOtpValid = function() {
    return this.emailOtp &&
           this.emailOtp.code &&
           this.emailOtp.expiresAt &&
           new Date() < this.emailOtp.expiresAt;
};

export default model('User', userSchema);