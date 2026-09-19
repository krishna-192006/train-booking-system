import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const { signup, loading } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const result = await signup(name, email, password, role);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-dark text-white p-4 text-center">
              <i className="bi bi-person-plus-fill fs-1 text-primary mb-2 d-block"></i>
              <h3 className="fw-bold mb-1">Create Account</h3>
              <p className="text-secondary small mb-0">Join RailExpress to book tickets seamlessly</p>
            </div>

            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-person"></i></span>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-key"></i></span>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-check2-circle"></i></span>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Account Role</label>
                  <select 
                    className="form-select" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="USER">User (Standard Passenger)</option>
                    <option value="ADMIN">Admin (Train Manager)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Registering Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg"></i> Complete Registration
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="card-footer bg-light p-3 text-center border-top">
              <span className="text-muted">Already have an account? </span>
              <Link to="/login" className="fw-bold text-primary text-decoration-none">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
