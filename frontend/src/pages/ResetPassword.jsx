// ResetPassword.jsx
import { useState } from "react";
import axios from "axios";
import { useSearchParams, useParams } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Shield, CheckCircle, AlertCircle } from "lucide-react";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const { token } = useParams();
    const [email, setEmail] = useState(searchParams.get("email") || "");
    // const [token, setToken] = useState(searchParams.get("token") || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSuccess, setIsSuccess] = useState(false)
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/api/v1/reset-password", {
                email,
                token,
                password,
                password_confirmation: confirmPassword,
            });
            setMessage(res.data.message);
            setIsSuccess(res.data.message.includes("Your password has been reset."))
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-400 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-slate-900" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-slate-400">Enter your new password below</p>
                </div>

                {/* Form Container */}
                <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
                    <div className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* New Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${password.length < 6
                                                    ? 'bg-red-500 w-1/3'
                                                    : password.length < 10
                                                        ? 'bg-amber-400 w-2/3'
                                                        : 'bg-green-500 w-full'
                                                }`}
                                        />
                                    </div>
                                    <span className={`text-sm ${password.length < 6
                                            ? 'text-red-400'
                                            : password.length < 10
                                                ? 'text-amber-400'
                                                : 'text-green-400'
                                        }`}>
                                        {password.length < 6 ? 'Weak' : password.length < 10 ? 'Medium' : 'Strong'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading || !password || !confirmPassword}
                            className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                    <span>Resetting...</span>
                                </div>
                            ) : (
                                "Reset Password"
                            )}
                        </button>

                        {/* Message Display */}
                        {message && (
                            <div className={`flex items-center space-x-2 p-4 rounded-lg ${isSuccess
                                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                }`}>
                                {isSuccess ? (
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                )}
                                <p className="text-sm">{message}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-slate-400 text-sm">
                        Remember your password?{' '}
                        <button onClick={() => window.location.href = "/"} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                            Sign in instead
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
