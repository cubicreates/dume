import { useState } from "react";
import { 
    User, 
    Lock, 
    GraduationCap, 
    Mail, 
    Eye, 
    EyeOff, 
    XCircle 
} from "lucide-react";

// Add Button component
const Button = ({ children, className = "", ...props }) => (
    <button
        className={`transition-colors duration-200 ${className}`}
        {...props}
    >
        {children}
    </button>
);

// Add InputField component
const InputField = ({ className = "", ...props }) => (
    <input
        className={`w-full outline-none focus:outline-none ${className}`}
        {...props}
    />
);

export default function Register({ isOpen, onClose, onLoginClick }) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("All fields are required");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Invalid email format");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setIsSubmitting(true);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitting(false);
                onClose();
                alert("Please check your email for verification link");
            } else {
                // Handle specific error cases
                if (data.code === 11000 && data.keyPattern?.username) {
                    setError('Username is already taken. Please choose another.');
                } else if (data.code === 11000 && data.keyPattern?.email) {
                    setError('Email is already registered. Please login instead.');
                } else {
                    setError(data.message || 'Registration failed');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-[420px] text-center relative my-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-gray-700"
                    aria-label="Close modal"
                >
                    <XCircle className="w-5 h-5" />
                </button>

                <GraduationCap className="text-blue-600 text-4xl sm:text-5xl mx-auto mb-2" />
                <h2 className="text-xl sm:text-2xl font-bold mb-2">UniGUIDE</h2>
                <p className="text-gray-500 text-sm sm:text-base mb-4">Welcome!</p>

                <div className="space-y-4">
                    <div className="flex items-center border rounded-lg px-3 py-2.5">
                        <User className="text-gray-500 mr-3 text-xl" />
                        <InputField
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full border-none focus:ring-0 text-base py-0.5"
                        />
                    </div>

                    <div className="flex items-center border rounded-lg px-3 py-2.5">
                        <Mail className="text-gray-500 mr-3 text-xl" />
                        <InputField
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border-none focus:ring-0 text-base py-0.5"
                        />
                    </div>

                    <div className="relative">
                        <div className="flex items-center border rounded-lg px-3 py-2.5">
                            <Lock className="text-gray-500 mr-3 text-xl" />
                            <InputField
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border-none focus:ring-0 text-base py-0.5"
                            />
                        </div>
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="relative">
                        <div className="flex items-center border rounded-lg px-3 py-2.5">
                            <Lock className="text-gray-500 mr-3 text-xl" />
                            <InputField
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full border-none focus:ring-0 text-base py-0.5"
                            />
                        </div>
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-base font-medium"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Registering..." : "Register"}
                    </Button>

                    <div className="mt-4 text-base">
                        <span className="text-gray-600">Already have an account? </span>
                        <button
                            onClick={onLoginClick}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Login here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}