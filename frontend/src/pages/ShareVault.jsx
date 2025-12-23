import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { toast } from "react-toastify";
import { format } from "date-fns";

export default function ShareVault() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vaultTitle, setVaultTitle] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxViews, setMaxViews] = useState(1);
  const [password, setPassword] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Set default expiration to 7 days from now
  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    setExpiresAt(format(defaultDate, "yyyy-MM-dd'T'HH:mm"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`/api/vault/${id}/share`, {
        expiresAt,
        maxViews: maxViews || 1,
        password: password || null,
      });

      // FIX HERE: Use rawToken and frontend origin
      const frontendUrl = `${window.location.origin}/access/${res.data.rawToken}`;
      setShareUrl(frontendUrl);

      toast.success("Share link generated!");
    } catch (err) {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 to-base-300 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="card bg-base-100 shadow-2xl hover:shadow-3xl transition-shadow duration-500">
          <div className="card-body p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-extrabold text-primary animate-fade-in">
                Generate Share Link
              </h1>
              <p className="text-lg text-base-content/70 mt-2">
                Vault:{" "}
                <span className="font-semibold text-primary">
                  {vaultTitle || "Loading..."}
                </span>
              </p>
            </div>

            {!shareUrl ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold flex items-center">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Expiration Date & Time
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="input input-bordered input-lg focus:input-primary transition-all duration-300 hover:shadow-md w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold flex items-center">
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Maximum Views (0 = unlimited)
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={maxViews}
                    onChange={(e) => setMaxViews(parseInt(e.target.value) || 0)}
                    className="input input-bordered input-lg focus:input-primary transition-all duration-300 hover:shadow-md w-full"
                    placeholder="1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold flex items-center">
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
                      Optional Password
                    </span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave empty for no password"
                    className="input input-bordered input-lg focus:input-primary transition-all duration-300 hover:shadow-md w-full"
                  />
                </div>

                <div className="card-actions justify-end mt-10 space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="btn btn-ghost btn-lg hover:bg-base-200 transition-all duration-300 transform hover:scale-105"
                    disabled={loading}
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg hover:btn-secondary transition-all duration-300 transform hover:scale-105 shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner mr-2"></span>
                        Generating...
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
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        Generate Link
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="alert alert-success shadow-lg animate-bounce">
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
                  <span>Share link created successfully!</span>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold flex items-center">
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
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      Shareable Link
                    </span>
                  </label>
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="input input-bordered input-lg w-full focus:input-primary transition-all duration-300 mb-4"
                  />
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="btn btn-primary btn-lg hover:btn-secondary transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy to Clipboard
                    </button>
                  </div>
                </div>

                <div className="bg-base-200 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-center mb-4 text-primary">
                    Link Details
                  </h3>
                  <div className="space-y-2 text-center">
                    <p className="text-sm opacity-80">
                      <strong>Expires:</strong>{" "}
                      {new Date(expiresAt).toLocaleString()}
                    </p>
                    <p className="text-sm opacity-80">
                      <strong>Max views:</strong> {maxViews || "Unlimited"}
                    </p>
                    <p className="text-sm opacity-80">
                      <strong>Password protected:</strong>{" "}
                      {password ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="btn btn-outline btn-lg w-full hover:btn-primary transition-all duration-300 transform hover:scale-105"
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
