import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/forgot-password`,
        { email: email.trim().toLowerCase() },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.message) {
        setSuccessMessage(response.data.message);
      } else {
        setSuccessMessage("Password reset instructions have been sent to your email address.");
      }

      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);

      if (err.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again.");
      } else if (err.response) {
        const status = err.response.status;
        const errorMessage = err.response.data?.message || err.response.data?.error;

        switch (status) {
          case 404:
            setError("No account found with this email address.");
            break;
          case 429:
            setError("Too many requests. Please try again later.");
            break;
          case 500:
            setError("Server error. Please try again later.");
            break;
          default:
            setError(errorMessage || "An error occurred. Please try again.");
        }
      } else if (err.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen font-sans bg-[#f9f3e5]">
      <header className="flex h-[70px] w-full px-10 py-5 text-white bg-[#213567] justify-between items-center">
        <Link to="/" className="flex flex-col items-center">
          <img src="/src/assets/logo.png" alt="Logo" className="h-[42px] w-[42px]" />
          <span className="mt-1 text-[11px] font-medium tracking-[0.2px] text-center"></span>
        </Link>
        <div className="flex items-center gap-6 text-white">
          <Link to="/login" className="text-[13px] hover:underline">
            Log in
          </Link>
        </div>
      </header>

      <main className="flex-1 flex px-4 items-center justify-center">
        <div className="max-w-md w-full p-10 text-center bg-white rounded-3xl shadow-xl">
          <h2 className="mb-3 text-[#213567] text-[28px] font-extrabold leading-snug">
            Find your
            <br />
            account
          </h2>

          <form onSubmit={handleSubmit} className="py-6 px-6 bg-white rounded-2xl shadow-md">
            <div className="mb-5 text-left">
              <p className="mb-2 text-[14px] text-[#374151] leading-tight">
                Enter your email to recover your account
              </p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full py-3 px-4 mb-2 text-[15px] placeholder-[#9ca3af] text-[#213567] border border-[#cbd5e1] rounded-full focus:outline-none focus:ring-2 focus:ring-[#213567] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {error && (
                <p className="px-1 mt-1 text-red-600 text-sm text-left" role="alert">
                  {error}
                </p>
              )}
              {successMessage && (
                <p className="px-1 mt-1 text-green-600 text-sm text-left" role="alert">
                  {successMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full py-3 text-white text-[15px] font-semibold bg-[#213567] rounded-full hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-[13px] text-[#6b7280]">
              Remember your password?{" "}
              <Link to="/login" className="text-[#213567] hover:underline font-medium">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
