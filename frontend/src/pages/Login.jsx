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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 text-center relative">
            <div className="w-14 h-14 bg-sky-500/20 text-sky-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-sky-500/30">
              <i className="bi bi-person-circle text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
            <p className="text-slate-400 text-xs mt-1">Sign in to book tickets &amp; manage your reservations</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                <i className="bi bi-exclamation-triangle-fill text-rose-500"></i>
                <div>{error}</div>
              </div>
            )}

            {/* Quick Demo Fill Buttons */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                Quick Demo Credentials:
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => fillQuickCredentials('user@trains.com', 'user123')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <i className="bi bi-person"></i> Passenger Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickCredentials('admin@trains.com', 'admin123')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <i className="bi bi-shield-lock"></i> Admin Demo
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <i className="bi bi-envelope"></i>
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                    placeholder="user@trains.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <i className="bi bi-key"></i>
                  </div>
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 text-sm transition cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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

          <div className="bg-slate-50 border-t border-slate-100 p-4 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-sky-600 hover:text-sky-700">
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
