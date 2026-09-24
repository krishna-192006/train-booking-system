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
  const [paymentMethod, setPaymentMethod] = useState('CARD'); // 'CARD', 'UPI', 'NETBANKING'
  
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState('');

  const { isAuthenticated } = useAuth();
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
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-semibold">Preparing booking summary &amp; seat allocation...</p>
      </div>
    );
  }

  if (error && !train) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl flex items-center gap-3">
          <i className="bi bi-exclamation-triangle-fill text-2xl text-rose-500"></i>
          <div>{error}</div>
        </div>
        <Link to="/trains" className="inline-block mt-4 text-sky-600 font-bold hover:underline">
          &larr; Back to Train Search
        </Link>
      </div>
    );
  }

  const classInfo = CLASS_CONFIG[classCode.toUpperCase()] || { label: classCode, description: 'Standard Coach', prefix: 'S' };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Card Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 mb-2">
              Review &amp; Book Ticket
            </span>
            <h2 className="text-2xl font-black text-white">{train?.name} ({train?.trainNumber})</h2>
          </div>
          <div>
            <span className="font-mono text-sm font-bold px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-sky-300">
              Class: {classCode.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <i className="bi bi-exclamation-triangle-fill text-rose-500 text-lg"></i>
              <div>{error}</div>
            </div>
          )}

          {/* Journey Overview Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-center sm:text-left">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">FROM</div>
                <div className="text-xl font-black text-slate-900">{train?.source}</div>
                <div className="text-sm font-bold text-sky-600">{train?.departureTime}</div>
              </div>

              <div className="text-center">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-xs mb-1">
                  <i className="bi bi-clock"></i> {train?.duration}
                </span>
                <div className="flex items-center justify-center gap-2 text-slate-300">
                  <div className="h-0.5 flex-1 bg-slate-200"></div>
                  <i className="bi bi-arrow-right text-sky-600 text-base"></i>
                  <div className="h-0.5 flex-1 bg-slate-200"></div>
                </div>
                <div className="text-xs text-slate-500 mt-1">Journey Date: <strong>{journeyDate}</strong></div>
              </div>

              <div className="sm:text-right">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">TO</div>
                <div className="text-xl font-black text-slate-900">{train?.destination}</div>
                <div className="text-sm font-bold text-rose-500">{train?.arrivalTime}</div>
              </div>
            </div>
          </div>

          {/* Automatic Seat Allocation Notice */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-sky-50 border border-sky-100 text-sky-900">
            <div className="w-9 h-9 rounded-xl bg-sky-200/60 flex items-center justify-center text-sky-700 shrink-0">
              <i className="bi bi-cpu text-lg"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-sky-950">Automatic Seat &amp; Berth Allocation</h4>
              <p className="text-xs text-sky-800/90 mt-0.5 leading-relaxed">
                Your coach (e.g. {classInfo.prefix}1, {classInfo.prefix}2), seat number, and berth type (Lower, Middle, Upper, Side Lower) will be automatically assigned by the backend upon booking confirmation.
              </p>
            </div>
          </div>

          {/* Fare Summary */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fare Breakdown</h4>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Base Ticket Fare ({classInfo.label})</span>
              <span className="font-bold text-slate-800">&#8377;{selectedClass?.price?.toLocaleString('en-IN') || 0}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Auto-Allocation Service Fee</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="font-bold text-slate-900 text-base">Total Amount</span>
              <span className="font-black text-2xl text-sky-600">&#8377;{selectedClass?.price?.toLocaleString('en-IN') || 0}</span>
            </div>
          </div>

          {/* Mock Payment Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <i className="bi bi-credit-card text-emerald-600"></i> Payment Method
              </h4>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Demo Payment
              </span>
            </div>

            <div className="space-y-2.5">
              <label
                onClick={() => setPaymentMethod('CARD')}
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'CARD'
                    ? 'border-sky-500 bg-sky-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={() => setPaymentMethod('CARD')}
                  className="accent-sky-600"
                />
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 text-xl shrink-0">
                  <i className="bi bi-credit-card-2-front"></i>
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Credit / Debit Card</div>
                  <div className="text-xs text-slate-500">Visa, Mastercard, RuPay (Simulated)</div>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('UPI')}
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'UPI'
                    ? 'border-sky-500 bg-sky-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="accent-sky-600"
                />
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl shrink-0">
                  <i className="bi bi-qr-code-scan"></i>
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">UPI Instant Payment</div>
                  <div className="text-xs text-slate-500">Google Pay, PhonePe, Paytm, BHIM (Simulated)</div>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'NETBANKING'
                    ? 'border-sky-500 bg-sky-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="NETBANKING"
                  checked={paymentMethod === 'NETBANKING'}
                  onChange={() => setPaymentMethod('NETBANKING')}
                  className="accent-sky-600"
                />
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl shrink-0">
                  <i className="bi bi-bank"></i>
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Net Banking</div>
                  <div className="text-xs text-slate-500">SBI, HDFC, ICICI, Axis and all major banks (Simulated)</div>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleBooking}
              disabled={bookingInProgress || selectedClass?.availableSeats === 0}
              className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-sm transition cursor-pointer disabled:opacity-60"
            >
              {bookingInProgress ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Allocating Seat &amp; Confirming...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-check text-lg"></i> Pay &amp; Auto-Assign Seat
                </>
              )}
            </button>

            <Link
              to="/trains"
              className="py-3.5 px-6 rounded-2xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 text-center text-sm transition"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
