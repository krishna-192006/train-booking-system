import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    location.pathname === path
      ? 'text-sky-400 font-semibold'
      : 'text-slate-300 hover:text-white transition';

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <i className="bi bi-train-front-fill text-xl"></i>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">RailExpress</span>
              <span className="bg-sky-500/20 text-sky-400 text-xs px-2 py-0.5 rounded-full font-medium border border-sky-500/30">
                Portfolio
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm flex items-center gap-1.5 ${isActive('/')}`}>
              <i className="bi bi-house-door"></i> Home
            </Link>
            <Link to="/trains" className={`text-sm flex items-center gap-1.5 ${isActive('/trains')}`}>
              <i className="bi bi-search"></i> Search Trains
            </Link>
            {isAuthenticated && (
              <Link to="/my-bookings" className={`text-sm flex items-center gap-1.5 ${isActive('/my-bookings')}`}>
                <i className="bi bi-ticket-detailed"></i> My Bookings
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm flex items-center gap-1.5 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-amber-400 font-semibold'
                    : 'text-amber-300 hover:text-amber-200 transition'
                }`}
              >
                <i className="bi bi-speedometer2"></i> Admin Dashboard
              </Link>
            )}
          </div>

          {/* User Section (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-medium transition cursor-pointer"
                >
                  <i className="bi bi-person-circle text-sky-400 text-lg"></i>
                  <span>{user?.name}</span>
                  {isAdmin && (
                    <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded border border-amber-500/30">
                      ADMIN
                    </span>
                  )}
                  <i className="bi bi-chevron-down text-xs text-slate-400"></i>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 z-50 text-sm">
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-200 hover:bg-slate-700/70"
                    >
                      <i className="bi bi-person text-slate-400"></i> My Profile
                    </Link>
                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-200 hover:bg-slate-700/70"
                    >
                      <i className="bi bi-ticket-perforated text-slate-400"></i> Booking History
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-amber-300 hover:bg-slate-700/70 font-medium"
                      >
                        <i className="bi bi-gear"></i> Manage Trains
                      </Link>
                    )}
                    <div className="border-t border-slate-700 my-1"></div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-slate-700/70 cursor-pointer"
                    >
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-4 space-y-2">
          <Link to="/" className="block py-2 text-sm text-slate-300 hover:text-white">
            <i className="bi bi-house-door mr-2"></i> Home
          </Link>
          <Link to="/trains" className="block py-2 text-sm text-slate-300 hover:text-white">
            <i className="bi bi-search mr-2"></i> Search Trains
          </Link>
          {isAuthenticated && (
            <Link to="/my-bookings" className="block py-2 text-sm text-slate-300 hover:text-white">
              <i className="bi bi-ticket-detailed mr-2"></i> My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="block py-2 text-sm text-amber-300 hover:text-amber-200">
              <i className="bi bi-speedometer2 mr-2"></i> Admin Dashboard
            </Link>
          )}
          <div className="border-t border-slate-800 pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-medium">Logged in as {user?.name}</div>
                <Link to="/profile" className="block py-1.5 text-sm text-slate-300">
                  <i className="bi bi-person mr-2"></i> Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-left py-1.5 text-sm text-rose-400"
                >
                  <i className="bi bi-box-arrow-right mr-2"></i> Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2 rounded-lg bg-slate-800 text-sm font-medium text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 text-center py-2 rounded-lg bg-sky-600 text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
