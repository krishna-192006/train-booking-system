import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const fillQuickCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-dark text-white p-4 text-center">
              <i className="bi bi-person-circle fs-1 text-primary mb-2 d-block"></i>
              <h3 className="fw-bold mb-1">User Login</h3>
              <p className="text-secondary small mb-0">Sign in to book tickets & manage reservations</p>
            </div>

            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <div>{error}</div>
                </div>
              )}

              {/* Demo Fill Buttons */}
              <div className="p-3 bg-light rounded-3 mb-4 border">
                <div className="fw-semibold small text-muted mb-2">Quick Demo Accounts:</div>
                <div className="d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-primary btn-sm flex-fill"
                    onClick={() => fillQuickCredentials('user@trains.com', 'user123')}
                  >
                    <i className="bi bi-person me-1"></i> User Demo
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-warning text-dark btn-sm flex-fill"
                    onClick={() => fillQuickCredentials('admin@trains.com', 'admin123')}
                  >
                    <i className="bi bi-shield-lock me-1"></i> Admin Demo
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-key"></i></span>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right"></i> Sign In
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="card-footer bg-light p-3 text-center border-top">
              <span className="text-muted">Don't have an account? </span>
              <Link to="/signup" className="fw-bold text-primary text-decoration-none">Sign Up Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
