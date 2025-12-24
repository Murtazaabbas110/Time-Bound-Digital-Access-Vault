import { useEffect, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/vault")
      .then((res) => setVaults(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 to-base-300 py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10 md:mb-12 bg-base-100 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-4xl md:text-5xl font-extrabold text-primary animate-fade-in">
              My Vaults
            </h1>
            <p className="text-base sm:text-lg text-base-content/70 mt-2">
              Manage your secure time-bound vaults
            </p>
          </div>
          <Link
            to="/create"
            className="btn btn-primary btn-md sm:btn-lg hover:btn-secondary transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
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
            Create New Vault
          </Link>
        </div>

        {/* Vaults Grid or Empty State */}
        {vaults.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-base-100 rounded-2xl shadow-xl">
            <div className="hero">
              <div className="hero-content text-center px-4">
                <div className="max-w-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 sm:h-24 sm:w-24 mx-auto text-base-content/50 mb-6"
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
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    No Vaults Yet
                  </h2>
                  <p className="text-base sm:text-lg text-base-content/70 mb-6">
                    Start by creating your first secure vault to share sensitive
                    information.
                  </p>
                  <Link
                    to="/create"
                    className="btn btn-primary btn-wide sm:btn-lg hover:btn-secondary transition-all duration-300"
                  >
                    Create Your First Vault
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vaults.map((vault, index) => (
              <div
                key={vault._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="card-body p-5 sm:p-6">
                  <div className="flex items-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-2 shrink-0"
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
                    <h2 className="card-title text-lg sm:text-xl line-clamp-1">
                      {vault.title}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-base-content/70 mb-4">
                    <span className="font-semibold">Created:</span>{" "}
                    {new Date(vault.createdAt).toLocaleDateString()}
                  </p>
                  <div className="card-actions flex flex-wrap sm:flex-nowrap justify-between gap-3">
                    <Link
                      to={`/vault/${vault._id}/share`}
                      className="btn btn-outline btn-primary btn-sm sm:btn-md hover:btn-primary transition-all duration-300 flex-1 sm:flex-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
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
                      Share
                    </Link>
                    <Link
                      to={`/vault/${vault._id}/logs`}
                      className="btn btn-ghost btn-sm sm:btn-md hover:bg-base-200 transition-all duration-300 flex-1 sm:flex-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Logs
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
