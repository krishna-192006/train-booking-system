import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-dark text-white p-4 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-person-circle fs-1"></i>
              </div>
              <h3 className="fw-bold mb-1">{user?.name}</h3>
              <span className={`badge px-3 py-1 fs-6 ${user?.role === 'ADMIN' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                {user?.role} ACCOUNT
              </span>
            </div>

            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 border-bottom pb-2">Account Information</h5>

              <div className="mb-3">
                <label className="text-muted small fw-semibold">FULL NAME</label>
                <div className="fs-5 fw-bold text-dark">{user?.name}</div>
              </div>

              <div className="mb-3">
                <label className="text-muted small fw-semibold">EMAIL ADDRESS</label>
                <div className="fs-5 fw-semibold text-dark">{user?.email}</div>
              </div>

              <div className="mb-4">
                <label className="text-muted small fw-semibold">USER ID</label>
                <div className="font-monospace text-secondary">#{user?.userId}</div>
              </div>

              <div className="d-flex gap-2">
                <Link to="/my-bookings" className="btn btn-primary flex-fill fw-bold py-2">
                  <i className="bi bi-ticket-perforated me-1"></i> View My Bookings
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="btn btn-warning flex-fill fw-bold py-2">
                    <i className="bi bi-speedometer2 me-1"></i> Admin Panel
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
