import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateVault from "./pages/CreateVault";
import ShareVault from "./pages/ShareVault";
import AccessPublic from "./pages/AccessPublic";
import VaultLogs from "./pages/VaultLogs";
import Navbar from "./components/Navbar";

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Main Layout with conditional Navbar
function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-base-200">
      {user && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/access/:token" element={<AccessPublic />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateVault />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vault/:id/share"
          element={
            <ProtectedRoute>
              <ShareVault />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vault/:id/logs"
          element={
            <ProtectedRoute>
              <VaultLogs />
            </ProtectedRoute>
          }
        />

        {/* redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

// Root Component
export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}
