import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-1.5">
              <i className="bi bi-train-front text-sky-400 text-xl"></i>
              <span className="font-bold text-lg text-white">RailExpress</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Modern Full-Stack Train Booking System Portfolio Application powered by Spring Boot &amp; React with Tailwind CSS.
            </p>
          </div>
          <div className="text-center md:text-right">
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs mb-2">
              <span className="flex items-center gap-1.5 text-slate-300">
                <i className="bi bi-shield-check text-emerald-400"></i> Secure JWT Auth
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <i className="bi bi-cpu text-sky-400"></i> Auto Seat Allocation
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <i className="bi bi-database text-amber-400"></i> MySQL JPA
              </span>
            </div>
            <div className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} RailExpress Portfolio Project. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
