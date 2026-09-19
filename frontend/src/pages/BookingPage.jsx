import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { CLASS_CONFIG } from '../utils/seatConfig';

const BookingPage = () => {
  const { trainId, classCode } = useParams();
  const [searchParams] = useSearchParams();
  const [journeyDate, setJourneyDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);

  const [train, setTrain] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState('');

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`/trains/${trainId}?date=${journeyDate}`);
        setTrain(response.data);

        const cls = response.data.classes.find(
          (c) => c.classCode.toUpperCase() === classCode.toUpperCase()
        );
        setSelectedClass(cls || null);
      } catch (err) {
        setError('Failed to fetch train booking details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainDetails();
  }, [trainId, classCode, journeyDate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${trainId}/${classCode}?date=${journeyDate}` } });
      return;
    }

    setBookingInProgress(true);
    setError('');

    try {
      const response = await axiosInstance.post('/bookings', {
        trainId: Number(trainId),
        classCode: classCode.toUpperCase(),
        journeyDate: journeyDate,
        paymentId: `demo_pay_${Date.now()}`,
        orderId: `demo_ord_${Date.now()}`
      });

      const booking = response.data;
      navigate(`/booking-confirmation/${booking.pnr}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed. Seat may no longer be available.';
      setError(msg);
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading details...</span>
        </div>
        <p className="mt-3 text-muted fw-semibold">Preparing your booking summary...</p>
      </div>
    );
  }

  if (error && !train) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm rounded-4 p-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i> {error}
        </div>
        <Link to="/trains" className="btn btn-outline-primary mt-2">
          &larr; Back to Train Search
        </Link>
      </div>
    );
  }

  const classInfo = CLASS_CONFIG[classCode.toUpperCase()] || { label: classCode, description: 'Standard Coach' };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">

          {/* Main Card */}
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">

            {/* Header */}
            <div className="card-header bg-dark text-white p-4 d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-primary text-uppercase px-3 py-1 mb-2">Review & Book</span>
                <h3 className="fw-bold m-0">{train?.name} ({train?.trainNumber})</h3>
              </div>
              <div className="text-end">
                <span className="badge bg-light text-dark font-monospace fs-6 px-3 py-2 border">
                  Class: {classCode.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="card-body p-4">

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                  <div>{error}</div>
                </div>
              )}

              {/* Journey Overview Box */}
              <div className="bg-light p-4 rounded-3 border mb-4">
                <div className="row text-center text-md-start align-items-center gy-3">
                  <div className="col-md-4">
                    <div className="text-muted small fw-semibold">FROM</div>
                    <div className="fs-4 fw-bold text-dark">{train?.source}</div>
                    <div className="text-primary fw-semibold">{train?.departureTime}</div>
                  </div>

                  <div className="col-md-4 text-center">
                    <div className="badge bg-white text-dark border px-3 py-1 mb-1">
                      <i className="bi bi-clock me-1"></i> {train?.duration}
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 text-muted">
                      <hr className="flex-fill my-0" />
                      <i className="bi bi-arrow-right text-primary fs-5"></i>
                      <hr className="flex-fill my-0" />
                    </div>
                    <div className="small text-muted mt-1">Journey Date: <strong>{journeyDate}</strong></div>
                  </div>

                  <div className="col-md-4 text-md-end">
                    <div className="text-muted small fw-semibold">TO</div>
                    <div className="fs-4 fw-bold text-dark">{train?.destination}</div>
                    <div className="text-danger fw-semibold">{train?.arrivalTime}</div>
                  </div>
                </div>
              </div>

              {/* Auto Allocation Notice Box */}
              <div className="alert alert-info border-info d-flex align-items-center gap-3 p-3 rounded-3 mb-4">
                <i className="bi bi-cpu fs-2 text-info"></i>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Automatic Seat & Berth Allocation</h6>
                  <p className="mb-0 small text-secondary">
                    Your seat, coach (e.g. {classInfo.prefix}1, {classInfo.prefix}2), and berth (Lower, Middle, Upper, Side Lower) will be automatically assigned by the backend upon booking.
                  </p>
                </div>
              </div>

              {/* Fare Summary */}
              <div className="card border-0 bg-light p-3 rounded-3 mb-4">
                <h6 className="fw-bold mb-3 border-bottom pb-2">Fare Breakdown</h6>
                <div className="d-flex justify-content-between mb-2 text-secondary">
                  <span>Base Ticket Fare ({classInfo.label})</span>
                  <span className="fw-semibold">&#8377;{selectedClass?.price?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-secondary">
                  <span>Auto-Allocation Service Fee</span>
                  <span className="text-success fw-semibold">FREE</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-extrabold text-dark">
                  <span>Total Amount Payable</span>
                  <span className="text-primary">&#8377;{selectedClass?.price?.toLocaleString('en-IN') || 0}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3">
                <button
                  type="button"
                  className="btn btn-primary btn-lg flex-fill py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  onClick={handleBooking}
                  disabled={bookingInProgress || selectedClass?.availableSeats === 0}
                >
                  {bookingInProgress ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Booking & Auto-Assigning Seat...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lightning-charge fs-5"></i> Confirm Booking & Auto-Assign Seat
                    </>
                  )}
                </button>

                <Link to="/trains" className="btn btn-outline-secondary btn-lg px-4 py-3 fw-semibold rounded-3">
                  Cancel
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
