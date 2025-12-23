// src/pages/Login.jsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate(); // For redirect after login

  const handleSubmit = async (e) => {
    e.preventDefault(); // ← THIS IS THE KEY LINE THAT WAS MISSING!

    if (!email || !password) {
      toast.error("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/"); // Redirect to dashboard
    } catch (err) {
      // Error already handled by axios interceptor + toast
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="hero min-h-screen bg-base-200">
    <div className="hero-content flex-col lg:flex-row-reverse">
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
          Securely share sensitive information that disappears after time or
          views.
        </p>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit}>
            <h2 className="card-title justify-center text-2xl">Login</h2>

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

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary hover:btn-secondary transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link to="/register" className="link link-hover text-sm hover:text-primary transition-colors">
                Don't have an account? Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}
