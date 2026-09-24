import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-sky-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-sky-600/30">
            <i className="bi bi-person-fill text-4xl"></i>
          </div>
          <h2 className="text-2xl font-black">{user?.name}</h2>
          <div className="mt-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                user?.role === 'ADMIN'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}
            >
              {user?.role} ACCOUNT
            </span>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
            Account Information
          </h3>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">FULL NAME</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">{user?.name}</div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">EMAIL ADDRESS</div>
              <div className="text-base font-semibold text-slate-800 mt-0.5">{user?.email}</div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">USER ID</div>
              <div className="font-mono text-sm font-semibold text-slate-500 mt-0.5">#{user?.userId}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <Link
              to="/my-bookings"
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-center text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition"
            >
              <i className="bi bi-ticket-perforated mr-1.5"></i> My Bookings
            </Link>
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-center text-amber-950 bg-amber-400 hover:bg-amber-300 shadow-md transition"
              >
                <i className="bi bi-speedometer2 mr-1.5"></i> Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
