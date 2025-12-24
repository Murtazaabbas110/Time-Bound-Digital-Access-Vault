import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { toast } from "react-toastify";

export default function CreateVault() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim())
      return toast.error("Both fields are required");

    setLoading(true);
    try {
      await api.post("/api/vault", { title, content });
      toast.success("Vault created successfully!");
      navigate("/");
    } catch (err) {
      // Error already handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 to-base-300 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-xl sm:max-w-2xl lg:max-w-4xl">
        <div className="card bg-base-100 shadow-2xl hover:shadow-3xl transition-shadow duration-500 rounded-2xl">
          <div className="card-body p-6 sm:p-8 lg:p-10">
            {/* Header Section */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-primary animate-bounce"
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
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary animate-fade-in">
                Create New Vault
              </h1>
              <p className="text-base sm:text-lg text-base-content/70 mt-2 max-w-prose mx-auto">
                Securely store and share sensitive information with time or view
                limits
              </p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base sm:text-lg font-semibold flex items-center">
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
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Title
                  </span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. API Key for Project X"
                  className="input input-bordered input-md sm:input-lg focus:input-primary transition-all duration-300 hover:shadow-md w-full"
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base sm:text-lg font-semibold flex items-center">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Sensitive Content
                  </span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your secret here... it will be encrypted"
                  className="textarea textarea-bordered textarea-md sm:textarea-lg min-h-48 sm:min-h-56 max-h-80 resize-y focus:textarea-primary transition-all duration-300 hover:shadow-md w-full"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="card-actions flex flex-col-reverse sm:flex-row sm:justify-end gap-4 mt-6 sm:mt-10">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="btn btn-ghost btn-md sm:btn-lg hover:bg-base-200 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
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
                  className="btn btn-primary btn-md sm:btn-lg hover:btn-secondary transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner mr-2"></span>
                      Creating...
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create Vault
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
