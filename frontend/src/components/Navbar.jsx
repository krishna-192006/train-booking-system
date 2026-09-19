import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active fw-bold' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark text-white shadow-sm sticky-top border-bottom border-primary-subtle">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
            <i className="bi bi-train-front-fill fs-5"></i>
          </div>
          <div>
            <span className="fw-bold tracking-tight text-white fs-4">RailExpress</span>
            <span className="badge bg-primary ms-2 text-uppercase fs-6" style={{ fontSize: '0.65rem' }}>Portfolio</span>
          </div>
        </Link>

        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-1">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/trains')}`} to="/trains">
                <i className="bi bi-search me-1"></i> Search Trains
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/my-bookings')}`} to="/my-bookings">
                  <i className="bi bi-ticket-detailed me-1"></i> My Bookings
                </Link>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link className={`nav-link text-warning ${isActive('/admin')}`} to="/admin">
                  <i className="bi bi-speedometer2 me-1"></i> Admin Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <div className="dropdown">
                <button 
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2 py-1 px-3 rounded-pill" 
                  type="button" 
                  id="userMenu" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5 text-primary"></i>
                  <span>{user?.name}</span>
                  {isAdmin && <span className="badge bg-warning text-dark me-1">ADMIN</span>}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="userMenu">
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/profile">
                      <i className="bi bi-person me-1"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/my-bookings">
                      <i className="bi bi-ticket-perforated me-1"></i> Booking History
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 py-2 text-warning fw-bold" to="/admin">
                        <i className="bi bi-gear me-1"></i> Manage Trains
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger d-flex align-items-center gap-2 py-2" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-1"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3 rounded-pill">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm px-3 rounded-pill fw-semibold">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
