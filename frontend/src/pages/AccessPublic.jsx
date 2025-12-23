import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { publicApi } from "../lib/api"; // ← CHANGE THIS
import { toast } from "react-toastify";

export default function AccessPublic() {
  const { token } = useParams();
  const [content, setContent] = useState("");
  const [meta, setMeta] = useState(null);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContent = async (pw = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await publicApi.get(
        // ← USE publicApi
        `/api/access/${token}${pw ? `?password=${pw}` : ""}`
      );
      setContent(res.data.content);
      setMeta(res.data.meta);
      setNeedsPassword(false);
    } catch (err) {
      const msg = err.response?.data?.error || "Access denied";
      setError(msg);
      if (msg.toLowerCase().includes("password")) {
        setNeedsPassword(true);
      } else {
        setNeedsPassword(false);
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    setContent("");
    setNeedsPassword(false);

    const query = new URLSearchParams(window.location.search);
    const urlPassword = query.get("password");

    if (urlPassword) {
      fetchContent(urlPassword);
    } else {
      // No password in URL → show form, don't auto-try
      setLoading(false);
      setNeedsPassword(true); // Assume protected until proven otherwise
    }
  }, [token]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    fetchContent(password);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 to-base-300 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-2xl hover:shadow-3xl transition-shadow duration-500 w-full max-w-4xl">
        <div className="card-body p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-primary animate-pulse"
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
            <h1 className="text-4xl font-extrabold text-primary animate-fade-in">
              Secure Vault Access
            </h1>
            <p className="text-lg text-base-content/70 mt-2">
              Access your shared sensitive information securely
            </p>
          </div>

          {/* Error Alert */}
          {error && !content && !needsPassword && (
            <div className="alert alert-error shadow-lg mb-6 animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Password Form */}
          {needsPassword && !content && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="alert alert-warning shadow-lg animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span>This vault is password protected.</span>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-primary"
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
                    Enter Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered input-lg text-center focus:input-primary transition-all duration-300 hover:shadow-md"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg w-full hover:btn-secondary transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
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
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                Unlock Vault
              </button>
            </form>
          )}

          {/* Content Display */}
          {content && (
            <>
              <div className="alert alert-success shadow-lg mb-6 animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Vault unlocked successfully!</span>
              </div>

              <div className="mockup-code bg-base-200 p-6 shadow-inner hover:shadow-lg transition-shadow duration-300">
                <pre className="whitespace-pre-wrap text-lg leading-relaxed">
                  {content}
                </pre>
              </div>

              {meta && (
                <div className="mt-8 bg-base-200 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-center mb-4 text-primary">
                    Vault Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="stat">
                      <div className="stat-title">Remaining Views</div>
                      <div className="stat-value text-primary">
                        {meta.remainingViews}
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Expires At</div>
                      <div className="stat-value text-secondary text-sm">
                        {new Date(meta.expiresAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
