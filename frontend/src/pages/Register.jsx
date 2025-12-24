// src/pages/Register.jsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // ← Prevents page reload!

    // Basic client-side validation
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      toast.success("Registration successful! Welcome!");
      navigate("/"); // Redirect to dashboard
    } catch (err) {
      // Errors from backend (e.g., email already exists) are handled by axios interceptor
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-linear-to-br from-base-200 via-base-300 to-base-100 animate-gradient-x">
      <div className="hero-content flex-col">
        {/* Text and Form Section */}
        <div className="text-center w-full max-w-md">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-primary animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-primary animate-fade-in">
              Time-Bound Vault
            </h1>
            <p className="py-4 md:py-6 text-base md:text-lg text-base-content/70 animate-fade-in delay-200">
              Create an account to start securely sharing sensitive information
              with time or view limits.
            </p>
          </div>
          <div className="card shrink-0 w-full shadow-2xl bg-base-100 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
            <form className="card-body" onSubmit={handleSubmit}>
              <h2 className="card-title justify-center text-xl md:text-2xl animate-fade-in delay-300">
                Register
              </h2>

              <div className="form-control relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer input input-bordered focus:input-primary transition-all duration-300 hover:shadow-md focus:scale-105 pt-10 pb-3 pl-4 pr-4 border-t-0 border-l-0 border-r-0 border-b-2 rounded-none bg-transparent"
                  placeholder=" "
                  required
                  disabled={loading}
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  }}
                />
                <label className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base text-base-content/60 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-primary peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-primary pointer-events-none flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  Email
                </label>
              </div>

              <div className="form-control relative mt-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer input input-bordered focus:input-primary transition-all duration-300 hover:shadow-md focus:scale-105 pt-10 pb-3 pl-4 pr-4 border-t-0 border-l-0 border-r-0 border-b-2 rounded-none bg-transparent"
                  placeholder=" "
                  required
                  disabled={loading}
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  }}
                />
                <label className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base text-base-content/60 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-primary peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-primary pointer-events-none flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                  Password
                </label>
              </div>

              <div className="form-control relative mt-6">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="peer input input-bordered focus:input-primary transition-all duration-300 hover:shadow-md focus:scale-105 pt-10 pb-3 pl-4 pr-4 border-t-0 border-l-0 border-r-0 border-b-2 rounded-none bg-transparent"
                  placeholder=" "
                  required
                  disabled={loading}
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  }}
                />
                <label className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base text-base-content/60 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-primary peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-primary pointer-events-none flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Confirm Password
                </label>
              </div>

              <div className="form-control mt-8">
                <button
                  type="submit"
                  className="btn btn-primary hover:btn-secondary transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner animate-spin"></span>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Register
                    </>
                  )}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="link link-hover text-sm hover:text-primary transition-all duration-300 hover:scale-105"
                >
                  Already have an account? Login here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
