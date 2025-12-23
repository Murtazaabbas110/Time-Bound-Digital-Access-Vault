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
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        {/* Image Section */}
        <div className="flex justify-center lg:justify-start">
          <img
            src="/house.png"
            alt="House"
            className="max-w-sm rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Text and Form Section */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold animate-pulse">Time-Bound Vault</h1>
          <p className="py-6 text-lg">
            Create an account to start securely sharing sensitive information
            with time or view limits.
          </p>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
              <h2 className="card-title justify-center text-2xl">Register</h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered focus:input-primary transition-colors"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered focus:input-primary transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input input-bordered focus:input-primary transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary hover:btn-secondary transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Creating account...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="link link-hover text-sm hover:text-primary transition-colors"
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
