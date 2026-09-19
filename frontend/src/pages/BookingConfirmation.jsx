import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const BookingConfirmation = () => {
  const { pnr } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`/bookings/${pnr}`);
        setBooking(response.data);
      } catch (err) {
        setError('Booking ticket not found for PNR: ' + pnr);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [pnr]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Fetching Ticket...</span>
        </div>
        <p className="mt-3 text-muted fw-semibold">Generating your e-ticket...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm rounded-4 p-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i> {error}
        </div>
        <Link to="/my-bookings" className="btn btn-primary mt-2">
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          
          {/* Confirmed Banner */}
          <div className="text-center mb-4">
            <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow" style={{ width: '70px', height: '70px' }}>
              <i className="bi bi-check-lg fs-1"></i>
            </div>
            <h2 className="fw-extrabold text-success">Booking Confirmed &check;</h2>
            <p className="text-muted">Your ticket has been booked & seat allocated automatically.</p>
          </div>

          {/* Ticket Card */}
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden border-top border-4 border-success">
            
            {/* Header / PNR Bar */}
            <div className="card-header bg-dark text-white p-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div>
                <span className="text-secondary small fw-bold d-block text-uppercase">PNR NUMBER</span>
                <span className="fs-3 fw-extrabold font-monospace text-warning tracking-wider">{booking.pnr}</span>
              </div>
              <div className="text-end">
                <span className={`badge fs-6 px-3 py-2 ${booking.status === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>
                  {booking.status}
                </span>
              </div>
            </div>

            <div className="card-body p-4">
              
              {/* Train & Route Details */}
              <div className="border-bottom pb-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4 className="fw-bold text-dark m-0">{booking.trainName}</h4>
                    <span className="badge bg-light text-dark border font-monospace mt-1">Train No: {booking.trainNumber}</span>
                  </div>
                  <div className="text-end">
                    <span className="text-muted small d-block">JOURNEY DATE</span>
                    <span className="fw-bold text-primary fs-5">{booking.journeyDate}</span>
                  </div>
                </div>

                <div className="row text-center text-md-start bg-light p-3 rounded-3 border">
                  <div className="col-md-5 mb-2 mb-md-0">
                    <div className="text-muted small">FROM</div>
                    <div className="fw-bold fs-5 text-dark">{booking.source}</div>
                    <div className="text-primary fw-semibold">{booking.departureTime}</div>
                  </div>
                  <div className="col-md-2 text-center my-auto">
                    <i className="bi bi-arrow-right fs-4 text-secondary"></i>
                  </div>
                  <div className="col-md-5 text-md-end">
                    <div className="text-muted small">TO</div>
                    <div className="fw-bold fs-5 text-dark">{booking.destination}</div>
                    <div className="text-danger fw-semibold">{booking.arrivalTime}</div>
                  </div>
                </div>
              </div>

              {/* Seat & Berth Allocation Detail Cards */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                  <div className="card bg-light border p-3 text-center rounded-3">
                    <div className="text-muted small fw-semibold">CLASS</div>
                    <div className="fs-4 fw-bold text-dark">{booking.classCode}</div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card bg-primary-subtle border-primary p-3 text-center rounded-3">
                    <div className="text-primary small fw-semibold">COACH</div>
                    <div className="fs-4 fw-bold text-primary">{booking.coach}</div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card bg-success-subtle border-success p-3 text-center rounded-3">
                    <div className="text-success small fw-semibold">SEAT NO</div>
                    <div className="fs-4 fw-bold text-success">{booking.seatNumber}</div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card bg-warning-subtle border-warning p-3 text-center rounded-3">
                    <div className="text-dark small fw-semibold">BERTH TYPE</div>
                    <div className="fs-5 fw-bold text-dark">{booking.berthType}</div>
                  </div>
                </div>
              </div>

              {/* Passenger & Fare Info */}
              <div className="bg-light p-3 rounded-3 border mb-4">
                <div className="row align-items-center">
                  <div className="col-md-6 mb-2 mb-md-0">
                    <div className="text-muted small">PASSENGER NAME</div>
                    <div className="fw-bold text-dark">{booking.userName} ({booking.userEmail})</div>
                    {booking.paymentId && (
                      <div className="mt-1 small text-muted">
                        <i className="bi bi-shield-check text-success me-1"></i>
                        Txn ID: <span className="font-monospace text-dark fw-semibold">{booking.paymentId}</span>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 text-md-end">
                    <div className="text-muted small">TOTAL FARE PAID</div>
                    <div className="fs-4 fw-extrabold text-success">&#8377;{booking.fare?.toLocaleString('en-IN')}</div>
                    {booking.orderId && (
                      <div className="small text-muted font-monospace">Order: {booking.orderId}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
                <button className="btn btn-outline-dark fw-bold d-flex align-items-center gap-2" onClick={() => window.print()}>
                  <i className="bi bi-printer me-1"></i> Print Ticket
                </button>

                <div className="d-flex gap-2">
                  <Link to="/my-bookings" className="btn btn-primary fw-bold">
                    <i className="bi bi-ticket-perforated me-1"></i> My Bookings
                  </Link>
                  <Link to="/" className="btn btn-outline-secondary">
                    Book Another Train
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
