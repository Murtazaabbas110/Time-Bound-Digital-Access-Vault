import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-lg px-4 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link
                to="/"
                className="hover:bg-primary hover:text-primary-content transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="hover:bg-primary hover:text-primary-content transition-colors"
              >
                My Vaults
              </Link>
            </li>
            <li>
              <Link
                to="/create"
                className="hover:bg-primary hover:text-primary-content transition-colors"
              >
                Create Vault
              </Link>
            </li>
          </ul>
        </div>
        <Link
          to="/"
          className="btn btn-ghost normal-case text-xl hover:scale-105 transition-transform duration-200"
        >
          🔒 Time Vault
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link
              to="/"
              className="hover:bg-primary hover:text-primary-content transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="hover:bg-primary hover:text-primary-content transition-colors"
            >
              My Vaults
            </Link>
          </li>
          <li>
            <Link
              to="/create"
              className="hover:bg-primary hover:text-primary-content transition-colors"
            >
              Create Vault
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-4">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li className="menu-title">
              <span className="text-sm">Hello, {user?.email}</span>
            </li>
            <li>
              <a className="hover:bg-primary hover:text-primary-content transition-colors">
                Profile
              </a>
            </li>
            <li>
              <a className="hover:bg-primary hover:text-primary-content transition-colors">
                Settings
              </a>
            </li>
            <li>
              <button
                onClick={logout}
                className="btn btn-outline btn-error btn-sm hover:btn-error-focus transition-colors"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
