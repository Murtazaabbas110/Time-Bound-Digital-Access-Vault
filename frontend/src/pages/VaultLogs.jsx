// src/pages/VaultLogs.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { format } from "date-fns";

export default function VaultLogs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vaultTitle, setVaultTitle] = useState("Loading...");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Optional: fetch vault title
        const vaultRes = await api.get(`/api/vault/${id}`);
        setVaultTitle(vaultRes.data.title || "Unknown Vault");

        const logsRes = await api.get(`/api/vault/${id}/logs`);
        setLogs(logsRes.data);
      } catch (err) {
        // Error handled by interceptor
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 to-base-300 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="card bg-base-100 shadow-2xl hover:shadow-3xl transition-shadow duration-500">
          <div className="card-body p-4 md:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="flex justify-center md:justify-start mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 md:h-16 md:w-16 text-primary animate-pulse"
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
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-primary animate-fade-in">
                  Access Logs
                </h1>
                <p className="text-base md:text-lg text-base-content/70 mt-2">
                  Vault:{" "}
                  <span className="font-semibold text-primary">
                    {vaultTitle}
                  </span>
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="btn btn-ghost btn-md md:btn-lg hover:bg-base-200 transition-all duration-300 transform hover:scale-105"
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

            {logs.length === 0 ? (
              <div className="text-center py-12 md:py-20 bg-base-200 rounded-2xl shadow-inner">
                <div className="hero">
                  <div className="hero-content text-center">
                    <div className="max-w-sm md:max-w-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 md:h-24 md:w-24 mx-auto text-base-content/50 mb-4"
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
                      <h2 className="text-xl md:text-3xl font-bold mb-4">
                        No Access Attempts Yet
                      </h2>
                      <p className="text-sm md:text-lg text-base-content/70 mb-6">
                        Share the link to start tracking views and access
                        attempts.
                      </p>
                      <Link
                        to={`/vault/${vaultId}/share`}
                        className="btn btn-primary btn-wide hover:btn-secondary transition-all duration-300"
                      >
                        Share Vault
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto bg-base-200 rounded-2xl p-2 md:p-4 shadow-inner">
                <table className="table table-zebra w-full">
                  <thead className="bg-primary text-primary-content">
                    <tr>
                      <th className="text-sm md:text-lg font-semibold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 md:h-5 md:w-5 inline mr-2"
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
                        Time
                      </th>
                      <th className="text-sm md:text-lg font-semibold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 md:h-5 md:w-5 inline mr-2"
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
                        Outcome
                      </th>
                      <th className="text-sm md:text-lg font-semibold">
                        Reason
                      </th>
                      <th className="hidden md:table-cell text-sm md:text-lg font-semibold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 md:h-5 md:w-5 inline mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                          />
                        </svg>
                        IP Address
                      </th>
                      <th className="hidden md:table-cell text-sm md:text-lg font-semibold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 md:h-5 md:w-5 inline mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        User Agent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr
                        key={index}
                        className="hover:bg-base-300 transition-colors duration-300"
                      >
                        <td className="font-medium text-sm md:text-base">
                          {format(new Date(log.accessedAt), "PPP p")}
                        </td>
                        <td>
                          <div
                            className={`badge ${
                              log.success
                                ? "badge-success animate-pulse"
                                : "badge-error"
                            } badge-sm md:badge-lg`}
                          >
                            {log.success ? "Allowed" : "Denied"}
                          </div>
                        </td>
                        <td className="capitalize text-sm md:text-base">
                          {log.outcome
                            .replace("denied_", "")
                            .replace("allowed", "Success")}
                        </td>
                        <td className="hidden md:table-cell font-mono text-xs md:text-sm bg-base-100 px-2 py-1 rounded">
                          {log.ipAddress || "Unknown"}
                        </td>
                        <td
                          className="hidden md:table-cell text-xs opacity-70 truncate max-w-xs tooltip"
                          data-tip={log.userAgent || "N/A"}
                        >
                          {log.userAgent || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
