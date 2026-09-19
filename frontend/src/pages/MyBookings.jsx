import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/bookings/my');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load your bookings history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel) return;
    setCancelling(true);
    setCancelMessage('');
    try {
      await axiosInstance.delete(`/bookings/${selectedBookingForCancel.id}`);
      setCancelMessage('Booking cancelled successfully.');
      fetchBookings();
      setSelectedBookingForCancel(null);
    } catch (err) {
      setCancelMessage(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-extrabold text-dark m-0">My Train Bookings</h2>
          <p className="text-muted m-0">Manage your current reservations and view ticket history</p>
        </div>
        <Link to="/trains" className="btn btn-primary fw-bold rounded-pill px-3">
          <i className="bi bi-plus-lg me-1"></i> Book New Ticket
        </Link>
      </div>

      {cancelMessage && (
        <div className="alert alert-info alert-dismissible fade show rounded-3" role="alert">
          <i className="bi bi-info-circle-fill me-2"></i> {cancelMessage}
          <button type="button" className="btn-close" onClick={() => setCancelMessage('')}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading history...</span>
          </div>
          <p className="mt-3 text-muted fw-semibold">Loading your booking history...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger shadow-sm rounded-4 p-4">
          <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i> {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 text-center p-5 bg-light">
          <i className="bi bi-ticket-perforated fs-1 text-muted mb-3 d-block"></i>
          <h4 className="fw-bold">No Bookings Found</h4>
          <p className="text-muted mb-4">You haven't booked any train tickets yet.</p>
          <div>
            <Link to="/trains" className="btn btn-primary btn-lg fw-bold px-4 rounded-pill shadow-sm">
              Search &amp; Book Trains
            </Link>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {bookings.map((booking) => {
            const isConfirmed = booking.status === 'CONFIRMED';
            return (
              <div key={booking.id} className={`card border-0 shadow-sm rounded-4 overflow-hidden border-start border-5 ${isConfirmed ? 'border-success' : 'border-secondary'}`}>
                <div className="card-header bg-white border-bottom py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-muted small fw-bold">PNR:</span>
                    <span className="fs-5 fw-bold font-monospace text-dark">{booking.pnr}</span>
                  </div>
                  <div>
                    <span className={`badge px-3 py-2 fs-6 ${isConfirmed ? 'bg-success' : 'bg-secondary'}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="card-body p-4">
                  <div className="row align-items-center gy-3 mb-3">
                    <div className="col-md-5">
                      <h4 className="fw-bold text-dark m-0">{booking.trainName}</h4>
                      <div className="text-muted small">Train No: <strong className="text-dark">{booking.trainNumber}</strong></div>
                      <div className="fw-semibold text-primary mt-1">{booking.source} &rarr; {booking.destination}</div>
                    </div>

                    <div className="col-md-3">
                      <div className="text-muted small">JOURNEY DATE</div>
                      <div className="fw-bold text-dark fs-5">{booking.journeyDate}</div>
                    </div>

                    <div className="col-md-4 text-md-end">
                      <div className="d-inline-flex flex-wrap gap-2 justify-content-md-end">
                        <span className="badge bg-light text-dark border px-2 py-1 fs-6">Class: <strong>{booking.classCode}</strong></span>
                        <span className="badge bg-primary-subtle text-primary border border-primary px-2 py-1 fs-6">Coach: <strong>{booking.coach}</strong></span>
                        <span className="badge bg-success-subtle text-success border border-success px-2 py-1 fs-6">Seat: <strong>{booking.seatNumber}</strong> ({booking.berthType})</span>
                      </div>
                      <div className="fs-4 fw-extrabold text-success mt-2">&#8377;{booking.fare?.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <hr className="my-3 text-secondary opacity-25" />

                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="text-muted small">
                      <span>Booked on: {new Date(booking.createdAt).toLocaleString()}</span>
                      {booking.paymentId && (
                        <span className="ms-3 badge bg-light text-dark border font-monospace">
                          <i className="bi bi-shield-check text-success me-1"></i>
                          Txn: {booking.paymentId}
                        </span>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      <Link to={`/booking-confirmation/${booking.pnr}`} className="btn btn-outline-primary btn-sm fw-semibold rounded-2 px-3">
                        <i className="bi bi-eye me-1"></i> View Details
                      </Link>

                      {isConfirmed && (
                        <button 
                          className="btn btn-outline-danger btn-sm fw-semibold rounded-2 px-3"
                          onClick={() => setSelectedBookingForCancel(booking)}
                        >
                          <i className="bi bi-x-circle me-1"></i> Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {selectedBookingForCancel && (
        <div className="modal show d-block tab-modal-backdrop" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">Cancel Ticket Confirmation</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedBookingForCancel(null)}></button>
              </div>
              <div className="modal-body p-4">
                <p>Are you sure you want to cancel booking for <strong>PNR: {selectedBookingForCancel.pnr}</strong>?</p>
                <div className="bg-light p-3 rounded-3 border">
                  <div><strong>Train:</strong> {selectedBookingForCancel.trainName} ({selectedBookingForCancel.trainNumber})</div>
                  <div><strong>Route:</strong> {selectedBookingForCancel.source} &rarr; {selectedBookingForCancel.destination}</div>
                  <div><strong>Seat:</strong> Coach {selectedBookingForCancel.coach}, Seat {selectedBookingForCancel.seatNumber}</div>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedBookingForCancel(null)}>Keep Ticket</button>
                <button type="button" className="btn btn-danger fw-bold" onClick={handleConfirmCancel} disabled={cancelling}>
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
