import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';

const OtpVerificationModal = ({ 
    isOpen, 
    onClose, 
    onVerify, 
    email,
    isSubmitting,
    error,
    onResend // Add this prop
}) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(100); // Changed to 100 seconds
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        let interval;
        if (isOpen && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, timer]);

    const handleChange = (index, value) => {
        if (value.match(/^[0-9]$/) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`)?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            await onResend();
            setTimer(100); // Reset timer to 100 seconds
            setOtp(['', '', '', '', '', '']); // Clear OTP fields
        } catch (error) {
            console.error('Failed to resend OTP:', error);
        } finally {
            setIsResending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <XCircle className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Verify Your Email
                    </h2>
                    <p className="text-gray-600 mb-1">
                        Enter the 6-digit code sent to
                    </p>
                    <p className="text-blue-600 font-medium">{email}</p>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-12 text-center border rounded-lg text-xl font-semibold
                                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-4">{error}</p>
                )}

                <button
                    onClick={() => onVerify(otp.join(''))}
                    className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium
                             hover:bg-blue-700 transition-colors disabled:bg-gray-400
                             disabled:cursor-not-allowed"
                    disabled={otp.some(digit => !digit) || isSubmitting}
                >
                    {isSubmitting ? "Verifying..." : "Verify Email"}
                </button>

                <div className="text-center mt-4">
                    {timer === 0 ? (
                        <button
                            onClick={handleResend}
                            className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400"
                            disabled={isResending}
                        >
                            {isResending ? 'Resending...' : 'Resend OTP'}
                        </button>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Resend OTP in {formatTime(timer)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtpVerificationModal;