import { useState, useEffect } from "react";
import { 
    User, 
    Lock, 
    GraduationCap,  
    Phone, 
    MessageSquare, 
    Eye, 
    EyeOff, 
    XCircle,
    Mail 
} from "lucide-react";
import OtpVerificationModal from './OtpVerificationModal';
import config from '../../config/config.js';
import { login, sendOtp, verifyOtp } from '../../utils/api.js';

// Add Button component before InputField
const Button = ({ children, className = "", ...props }) => (
    <button
        className={`transition-colors duration-200 ${className}`}
        {...props}
    >
        {children}
    </button>
);

// Existing InputField component
const InputField = ({ className = "", ...props }) => (
    <input
        className={`w-full outline-none focus:outline-none ${className}`}
        {...props}
    />
);

export default function LoginModal({ isOpen, onClose, onRegisterClick, onLoginSuccess }) {
    const [emailAddress, setEmailAddress] = useState("");
    const [verificationError, setVerificationError] = useState("");
    const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isOtpVerificationModalOpen, setIsOtpVerificationModalOpen] = useState(false);
    const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
    const [isOtpMode, setIsOtpMode] = useState(null); // null means both are active

    // Split the error states for each login method
    const [credentialError, setCredentialError] = useState("");
    const [otpError, setOtpError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Check credentials
        if (username === "ad" && password === "123") {
            console.log("LoginModal: Credentials verified"); // Debug log
            onLoginSuccess?.(); // Call the success handler
        } else {
            console.log("LoginModal: Invalid credentials"); // Debug log
            // Handle invalid credentials
        }
    };

    // State for main login form
    const [showPassword, setShowPassword] = useState(false);

    // State for resend functionality
    const [resendTimer, setResendTimer] = useState(60);
    const [isResendAvailable, setIsResendAvailable] = useState(false);
    const [showResendOptions, setShowResendOptions] = useState(false);

    const [isEditingPhone, setIsEditingPhone] = useState(false);

    // Validation functions
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone) => {
        return /^\d{10}$/.test(phone);
    };



    // Effect for resetting resend state
    useEffect(() => {
        if (resendTimer === 0) {
            setIsResendAvailable(true);
            setResendTimer(60);
        }
    }, [resendTimer]);

    // Handle login with email/password
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmittingLogin(true);
      
        try {
          const response = await fetch(`${config.SERVER_URL}${config.API_ENDPOINTS.LOGIN}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
          });
      
          const data = await response.json();
      
          if (response.ok) {
            console.log('Login response:', data); // Debug log
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('email', data.email); // Make sure this is set
            onLoginSuccess?.();
            onClose();
          } else {
            setLoginError(data.message || "Login failed");
          }
        } catch (error) {
          console.error('Login error:', error);
          setLoginError("An error occurred during login");
        } finally {
          setIsSubmittingLogin(false);
        }
      };

    // Add this function to your LoginModal component
    const handleEmailOtpLogin = async () => {
        if (!validateEmail(emailAddress)) {
            setOtpError("Please enter a valid email");
            return;
        }
        
        setIsSubmittingLogin(true);
        setOtpError("");

        try {
            // Log the request details
            console.log('Sending OTP request to:', `${config.SERVER_URL}${config.API_ENDPOINTS.SEND_OTP}`);
            console.log('Request payload:', { email: emailAddress });

            const response = await fetch(`${config.SERVER_URL}${config.API_ENDPOINTS.SEND_OTP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: emailAddress })
            });

            // Log the response status
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                setOtpError('');
                setIsOtpVerificationModalOpen(true);
            } else {
                if (data.message === 'User not found') {
                    setOtpError('You are not registered. Please Register!');
                } else if (data.message === 'Email not verified') {
                    setOtpError('Please verify your email before logging in');
                } else {
                    setOtpError(data.message || 'Failed to send OTP');
                }
            }
        } catch (error) {
            console.error('OTP Error:', error);
            setOtpError('Failed to send OTP. Please try again.');
        } finally {
            setIsSubmittingLogin(false);
        }
    };

    // Add this function to handle email input focus
    const handleEmailFocus = () => {
        setIsOtpMode(true);
        setUsername('');
        setPassword('');
        setCredentialError(''); // Clear credential error when switching to OTP
    };

    // Add this function to handle username/password input focus
    const handleCredentialsFocus = () => {
        setIsOtpMode(false);
        setEmailAddress('');
        setOtpError(''); // Clear OTP error when switching to credentials
    };

    // Add OTP verification handler
    const handleOtpVerification = async (otpCode) => {
        setIsSubmittingOtp(true);
        setVerificationError('');

        try {
            const response = await fetch(`${config.SERVER_URL}${config.API_ENDPOINTS.VERIFY_OTP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: emailAddress, 
                    otp: otpCode 
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                setIsOtpVerificationModalOpen(false);
                onLoginSuccess?.();
                onClose();
            } else {
                setVerificationError(data.message || 'Invalid OTP');
            }
        } catch (error) {
            setVerificationError('Verification failed. Please try again.');
        } finally {
            setIsSubmittingOtp(false);
        }
    };

    // Add this to your LoginModal component
    const handleResendOtp = async () => {
        try {
            const response = await fetch(`${config.SERVER_URL}${config.API_ENDPOINTS.SEND_OTP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: emailAddress })
            });

            if (!response.ok) {
                throw new Error('Failed to resend OTP');
            }

            // Reset verification error if any
            setVerificationError('');
        } catch (error) {
            setVerificationError('Failed to resend OTP. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-[380px] text-center relative min-h-[200px] my-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700"
                        aria-label="Close modal"
                    >
                        <XCircle className="w-4 h-4" />
                    </button>

                    <GraduationCap className="text-blue-600 text-3xl sm:text-4xl mx-auto mb-1" />
                    <h2 className="text-lg sm:text-xl font-bold mb-1">UniGUIDE</h2>
                    <p className="text-gray-500 text-xs sm:text-sm mb-3">Welcome!</p>

                   
                            <div className="space-y-4">
                                <div className={`space-y-4 ${isOtpMode === true ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center border rounded-lg px-3 py-2">
                                        <User className="text-gray-500 mr-2" />
                                        <InputField
                                            type="text"
                                            placeholder="Username/Email"
                                            value={username}
                                            onChange={(e) => {
                                                setUsername(e.target.value);
                                                setLoginError("");
                                            }}
                                            onFocus={handleCredentialsFocus}
                                            className="w-full border-none focus:ring-0"
                                            disabled={isOtpMode === true}
                                            aria-invalid={!!loginError}
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-center border rounded-lg px-3 py-2">
                                            <Lock className="text-gray-500 mr-2" />
                                            <InputField
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    setLoginError("");
                                                }}
                                                onFocus={handleCredentialsFocus}
                                                placeholder="Password"
                                                className="w-full border-none focus:ring-0"
                                                disabled={isOtpMode === true}
                                            />
                                        </div>
                                        <button
                                            className="absolute right-3 top-3 p-1 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff /> : <Eye />}
                                        </button>
                                    </div>

                                    {credentialError && <p className="text-red-500 text-sm">{credentialError}</p>}

                                    <button
                                        onClick={handleLogin}
                                        className={`w-full py-2 rounded-lg ${
                                            isOtpMode === true 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-blue-600 hover:bg-blue-700'
                                        } text-white`}
                                        disabled={isOtpMode === true || isSubmittingLogin}
                                    >
                                        {isSubmittingLogin ? "Logging in..." : "Login"}
                                    </button>
                                </div>

                                <div className="flex items-center my-4">
                                    <hr className="flex-grow border-gray-300" />
                                    <span className="px-2 text-gray-500 text-sm">OR LOGIN WITH OTP</span>
                                    <hr className="flex-grow border-gray-300" />
                                </div>

                                {/* Add OTP login section */}
                                <div className={`space-y-4 ${isOtpMode === false ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center border rounded-lg px-3 py-2">
                                        <Mail className="text-gray-500 mr-2" />
                                        <InputField
                                            type="email"
                                            placeholder="Enter your email"
                                            value={emailAddress}
                                            onChange={(e) => {
                                                setEmailAddress(e.target.value);
                                                setLoginError("");
                                            }}
                                            onFocus={handleEmailFocus}
                                            className="w-full border-none focus:ring-0"
                                            disabled={isOtpMode === false}
                                        />
                                    </div>

                                    {otpError && (
                                        <p className="text-red-500 text-sm">
                                            {otpError}
                                            {otpError === 'You are not registered. Please Register!'}
                                        </p>
                                    )}

                                    <Button
                                        onClick={handleEmailOtpLogin}
                                        className={`w-full py-2 rounded-lg flex items-center justify-center ${
                                            isOtpMode === false || !emailAddress || !validateEmail(emailAddress)
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                        } text-white`}
                                        disabled={!isOtpMode || !emailAddress || !validateEmail(emailAddress) || isSubmittingLogin}
                                    >
                                        <Mail className="mr-2" size={20} />
                                        {isSubmittingLogin ? "Sending OTP..." : "Get OTP via Email"}
                                    </Button>
                                </div>

                                {/* Existing registration section */}
                                <div className="mt-4 text-sm">
                                    <span className="text-gray-600">New to UniGUIDE? </span>
                                    <button
                                        onClick={onRegisterClick}
                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Register here
                                    </button>
                                </div>
                    
                            </div>

                            
                     
                    
                </div>
            </div>
            <OtpVerificationModal 
                isOpen={isOtpVerificationModalOpen}
                onClose={() => setIsOtpVerificationModalOpen(false)}
                onVerify={handleOtpVerification}
                onResend={handleResendOtp}
                email={emailAddress}
                isSubmitting={isSubmittingOtp}
                error={verificationError}
            />
        </>
    );
}

