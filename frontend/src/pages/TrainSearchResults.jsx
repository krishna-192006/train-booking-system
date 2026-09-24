import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { CLASS_CONFIG } from '../utils/seatConfig';

const TrainSearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [source, setSource] = useState(searchParams.get('source') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [journeyDate, setJourneyDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);

  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const fetchTrains = async () => {
    setLoading(true);
    setError('');
    try {
      let url = '/trains/search';
      const params = new URLSearchParams();
      if (source) params.append('source', source);
      if (destination) params.append('destination', destination);
      if (journeyDate) params.append('date', journeyDate);

      const queryStr = params.toString();
      if (queryStr) url += `?${queryStr}`;

      const response = await axiosInstance.get(url);
      setTrains(response.data);
    } catch (err) {
      setError('Failed to fetch train search results. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({
      source,
      destination,
      date: journeyDate
    });
  };

  const handleBookClass = (trainId, classCode) => {
    navigate(`/booking/${trainId}/${classCode}?date=${journeyDate}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Filter Bar */}
      <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 text-white">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              FROM
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              placeholder="Source City"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              TO
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              placeholder="Destination City"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              JOURNEY DATE
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="lg:col-span-3">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/30 flex items-center justify-center gap-2 text-sm transition cursor-pointer"
            >
              <i className="bi bi-search"></i> Modify Search
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <i className="bi bi-train-freight-front text-sky-600"></i>
          <span>{trains.length} Trains Available</span>
        </h2>
        {(searchParams.get('source') || searchParams.get('destination')) && (
          <span className="text-sm font-medium text-slate-500">
            Route: <strong className="text-slate-800">{searchParams.get('source') || 'Any'}</strong> &rarr;{' '}
            <strong className="text-slate-800">{searchParams.get('destination') || 'Any'}</strong> on{' '}
            <strong className="text-slate-800">{journeyDate}</strong>
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold text-base">Searching available trains &amp; real-time seat capacities...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
          <i className="bi bi-exclamation-triangle-fill text-2xl text-rose-500"></i>
          <span className="font-medium">{error}</span>
        </div>
      ) : trains.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <i className="bi bi-emoji-frown text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Trains Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            We couldn't find any direct trains matching your source and destination. Try searching for major cities like Delhi, Lucknow, Mumbai, or Jaipur.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {trains.map((train) => (
            <div
              key={train.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              {/* Card Top Banner */}
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow-sm">
                    {train.trainNumber}
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900">{train.name}</h3>
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                  Daily Express
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Station Timings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div>
                    <div className="text-2xl font-black text-slate-900">{train.departureTime}</div>
                    <div className="text-sm font-bold text-sky-600 mt-0.5">{train.source}</div>
                  </div>

                  <div className="text-center flex flex-col items-center">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-xs mb-2">
                      <i className="bi bi-clock"></i> {train.duration}
                    </span>
                    <div className="w-full flex items-center justify-center gap-2 text-slate-300">
                      <div className="h-0.5 flex-1 bg-slate-200"></div>
                      <i className="bi bi-train-front-fill text-sky-600 text-base"></i>
                      <div className="h-0.5 flex-1 bg-slate-200"></div>
                    </div>
                  </div>

                  <div className="md:text-right">
                    <div className="text-2xl font-black text-slate-900">{train.arrivalTime}</div>
                    <div className="text-sm font-bold text-rose-500 mt-0.5">{train.destination}</div>
                  </div>
                </div>

                {/* Class & Seat Availability Grid */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Available Classes &amp; Auto-Allocated Fares
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {train.classes &&
                      train.classes.map((cls) => {
                        const config = CLASS_CONFIG[cls.classCode] || { label: cls.classCode };
                        const isAvailable = cls.availableSeats > 0;

                        return (
                          <div
                            key={cls.classCode}
                            className={`p-4 rounded-2xl border text-center flex flex-col justify-between transition ${
                              isAvailable
                                ? 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-sm'
                                : 'bg-slate-50 border-slate-200 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-black text-lg text-slate-900">{cls.classCode}</span>
                              <span className="text-2xs font-semibold uppercase text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {config.label}
                              </span>
                            </div>

                            <div className="text-2xl font-black text-emerald-600 my-1">
                              &#8377;{cls.price.toLocaleString('en-IN')}
                            </div>

                            <div className="mb-3">
                              {isAvailable ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                  <i className="bi bi-check-circle-fill"></i> {cls.availableSeats} seats left
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                                  <i className="bi bi-x-circle-fill"></i> Sold Out
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => isAvailable && handleBookClass(train.id, cls.classCode)}
                              disabled={!isAvailable}
                              className={`w-full py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
                                isAvailable
                                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              {isAvailable ? 'Book' : 'Full'}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainSearchResults;
