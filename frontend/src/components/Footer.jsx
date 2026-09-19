import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row gy-3 align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <i className="bi bi-train-front text-primary fs-5"></i>
              <span className="fw-bold fs-5 text-white">RailExpress</span>
            </div>
            <p className="text-secondary small mb-0">
              Modern Full-Stack Train Booking System Portfolio Application powered by Spring Boot & React.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 text-secondary small mb-2">
              <span><i className="bi bi-shield-check text-success me-1"></i> Secure JWT Auth</span>
              <span><i className="bi bi-cpu text-info me-1"></i> Auto Seat Allocation</span>
              <span><i className="bi bi-database text-warning me-1"></i> MySQL JPA</span>
            </div>
            <div className="text-secondary small">
              &copy; {new Date().getFullYear()} RailExpress Portfolio Project. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
