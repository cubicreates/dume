import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function VerificationFailed() {
    const [countdown, setCountdown] = useState(20);
    const navigate = useNavigate();

    useEffect(() => {
        // Start countdown
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        // Redirect when countdown reaches 0
        if (countdown === 0) {
            navigate('/');
        }

        // Cleanup timer
        return () => clearInterval(timer);
    }, [countdown, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Verification Failed
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        The verification link is invalid or has expired. Please request a new verification email.
                    </p>
                    <p className="mt-4 text-sm text-gray-500">
                        Redirecting to home in {countdown} seconds...
                    </p>
                </div>
                <div>
                    <Link
                        to="/"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}