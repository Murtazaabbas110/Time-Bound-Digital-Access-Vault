import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateVault from "./pages/CreateVault";
import ShareVault from "./pages/ShareVault";
import AccessPublic from "./pages/AccessPublic";
import VaultLogs from "./pages/VaultLogs";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  return user ? children : <Login />;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <div className="min-h-screen bg-base-200">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/access/:token" element={<AccessPublic />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreateVault />
              </PrivateRoute>
            }
          />
          <Route
            path="/vault/:id/share"
            element={
              <PrivateRoute>
                <ShareVault />
              </PrivateRoute>
            }
          />
          <Route
            path="/vault/:id/logs"
            element={
              <PrivateRoute>
                <VaultLogs />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
