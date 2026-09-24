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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Train Reservations</h1>
          <p className="text-sm text-slate-500 mt-1">Review, print tickets, or cancel your active train journeys</p>
        </div>
        <Link
          to="/trains"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/25 transition cursor-pointer self-start sm:self-auto"
        >
          <i className="bi bi-plus-lg"></i> Book New Ticket
        </Link>
      </div>

      {cancelMessage && (
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="bi bi-info-circle-fill text-sky-600"></i>
            <span>{cancelMessage}</span>
          </div>
          <button
            onClick={() => setCancelMessage('')}
            className="text-sky-800 hover:text-sky-950 font-bold px-2 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold text-sm">Loading your booking history...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
          <i className="bi bi-exclamation-triangle-fill text-2xl text-rose-500"></i>
          <span className="font-medium">{error}</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <i className="bi bi-ticket-perforated text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Bookings Yet</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6 max-w-sm mx-auto">
            You haven't booked any train tickets. Search routes and reserve seats in just a few clicks!
          </p>
          <Link
            to="/trains"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md transition"
          >
            Search &amp; Book Trains
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isConfirmed = booking.status === 'CONFIRMED';
            return (
              <div
                key={booking.id}
                className={`bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden border-l-4 ${
                  isConfirmed ? 'border-l-emerald-500' : 'border-l-slate-400'
                }`}
              >
                {/* Header / PNR bar */}
                <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">PNR:</span>
                    <span className="font-mono text-base font-black text-slate-900">{booking.pnr}</span>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5">
                      <h3 className="text-lg font-black text-slate-900">{booking.trainName}</h3>
                      <div className="text-xs text-slate-500">
                        Train No: <strong className="text-slate-800">{booking.trainNumber}</strong>
                      </div>
                      <div className="text-sm font-bold text-sky-600 mt-1">
                        {booking.source} &rarr; {booking.destination}
                      </div>
                    </div>

                    <div className="md:col-span-3">
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">JOURNEY DATE</div>
                      <div className="text-base font-black text-slate-900 mt-0.5">{booking.journeyDate}</div>
                    </div>

                    <div className="md:col-span-4 md:text-right">
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                          Class: {booking.classCode}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                          Coach: {booking.coach}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Seat: {booking.seatNumber} ({booking.berthType})
                        </span>
                      </div>
                      <div className="text-xl font-black text-emerald-600 mt-2">
                        &#8377;{booking.fare?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                    <div>
                      Booked on: {new Date(booking.createdAt).toLocaleString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/booking-confirmation/${booking.pnr}`}
                        className="px-3.5 py-1.5 rounded-xl font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition"
                      >
                        <i className="bi bi-eye mr-1"></i> View Ticket
                      </Link>

                      {isConfirmed && (
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForCancel(booking)}
                          className="px-3.5 py-1.5 rounded-xl font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
                        >
                          <i className="bi bi-x-circle mr-1"></i> Cancel Booking
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <i className="bi bi-exclamation-octagon text-xl"></i> Cancel Ticket Confirmation
              </h3>
              <button
                type="button"
                onClick={() => setSelectedBookingForCancel(null)}
                className="text-white hover:text-rose-100 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Are you sure you want to cancel the ticket for <strong className="text-slate-900">PNR: {selectedBookingForCancel.pnr}</strong>?
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1.5 text-slate-700">
                <div><strong>Train:</strong> {selectedBookingForCancel.trainName} ({selectedBookingForCancel.trainNumber})</div>
                <div><strong>Route:</strong> {selectedBookingForCancel.source} &rarr; {selectedBookingForCancel.destination}</div>
                <div><strong>Seat:</strong> Coach {selectedBookingForCancel.coach}, Seat {selectedBookingForCancel.seatNumber} ({selectedBookingForCancel.berthType})</div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedBookingForCancel(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
              >
                Keep Ticket
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition cursor-pointer disabled:opacity-60"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
