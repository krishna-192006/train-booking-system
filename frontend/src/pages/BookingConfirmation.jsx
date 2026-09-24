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
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-semibold">Generating your e-ticket...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl flex items-center gap-3">
          <i className="bi bi-exclamation-triangle-fill text-2xl text-rose-500"></i>
          <div>{error}</div>
        </div>
        <Link to="/my-bookings" className="inline-block mt-4 text-sky-600 font-bold hover:underline">
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Success Banner */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm border border-emerald-200">
          <i className="bi bi-check-lg text-3xl font-black"></i>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Booking Confirmed &check;</h1>
        <p className="text-slate-500 text-sm mt-1">Your ticket has been booked and seat allocated automatically.</p>
      </div>

      {/* Ticket Card */}
      <div className="bg-white rounded-3xl border-t-4 border-emerald-500 border-x border-b border-slate-200 shadow-2xl overflow-hidden print:border-none print:shadow-none">
        {/* Header / PNR Bar */}
        <div className="bg-slate-900 text-white p-6 sm:p-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">PNR NUMBER</span>
            <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400 tracking-wider">
              {booking.pnr}
            </span>
          </div>
          <div>
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                booking.status === 'CONFIRMED'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {booking.status}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Train & Timing Details */}
          <div className="space-y-4 pb-6 border-b border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-black text-slate-900">{booking.trainName}</h2>
                <span className="inline-block mt-1 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Train No: {booking.trainNumber}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">JOURNEY DATE</span>
                <span className="text-base font-bold text-sky-600">{booking.journeyDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center sm:text-left">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">FROM</div>
                <div className="text-lg font-black text-slate-900">{booking.source}</div>
                <div className="text-xs font-bold text-sky-600">{booking.departureTime}</div>
              </div>
              <div className="text-center text-slate-300 hidden sm:block">
                <i className="bi bi-arrow-right text-2xl text-slate-400"></i>
              </div>
              <div className="sm:text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase">TO</div>
                <div className="text-lg font-black text-slate-900">{booking.destination}</div>
                <div className="text-xs font-bold text-rose-500">{booking.arrivalTime}</div>
              </div>
            </div>
          </div>

          {/* Seat & Berth Allocation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CLASS</div>
              <div className="text-xl font-black text-slate-900 mt-0.5">{booking.classCode}</div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 text-center">
              <div className="text-xs font-semibold text-sky-700 uppercase tracking-wider">COACH</div>
              <div className="text-xl font-black text-sky-700 mt-0.5">{booking.coach}</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-center">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">SEAT NO</div>
              <div className="text-xl font-black text-emerald-700 mt-0.5">{booking.seatNumber}</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-center">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">BERTH TYPE</div>
              <div className="text-base font-black text-amber-800 mt-1">{booking.berthType}</div>
            </div>
          </div>

          {/* Passenger & Fare Info */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">PASSENGER NAME</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {booking.userName} <span className="text-xs font-normal text-slate-500">({booking.userEmail})</span>
              </div>
            </div>
            <div className="sm:text-right">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">TOTAL FARE PAID</div>
              <div className="text-2xl font-black text-emerald-600 mt-0.5">
                &#8377;{booking.fare?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <i className="bi bi-printer"></i> Print Ticket
            </button>

            <div className="flex items-center gap-2.5">
              <Link
                to="/my-bookings"
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition"
              >
                My Bookings
              </Link>
              <Link
                to="/"
                className="px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Book Another
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
