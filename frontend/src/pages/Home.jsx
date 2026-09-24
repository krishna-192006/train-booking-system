import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [source, setSource] = useState('Delhi');
  const [destination, setDestination] = useState('Lucknow');
  const [journeyDate, setJourneyDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/trains?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&date=${journeyDate}`);
  };

  const quickRoutes = [
    { from: 'Delhi', to: 'Lucknow', code: '12430', name: 'Rajdhani Express' },
    { from: 'Delhi', to: 'Jaipur', code: '12015', name: 'Shatabdi Express' },
    { from: 'Mumbai', to: 'Ahmedabad', code: '20901', name: 'Vande Bharat' },
    { from: 'Kolkata', to: 'Delhi', code: '12259', name: 'Duronto Express' },
    { from: 'Bengaluru', to: 'Delhi', code: '12649', name: 'Sampark Kranti' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-16 lg:py-24">
        {/* Decorative blur backdrop */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <i className="bi bi-stars"></i> Smart Automatic Seat Allocation
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Book Train Tickets <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">Effortlessly</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Experience seamless railway reservations with automatic coach and berth assignment, real-time availability, and instant PNR generation.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-700/60">
                  <i className="bi bi-check-circle-fill text-emerald-400 text-base"></i>
                  <span>No Clickable Seat Grids</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-700/60">
                  <i className="bi bi-check-circle-fill text-emerald-400 text-base"></i>
                  <span>Instant 10-Digit PNR</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-700/60">
                  <i className="bi bi-check-circle-fill text-emerald-400 text-base"></i>
                  <span>Double-Booking Protection</span>
                </div>
              </div>
            </div>

            {/* Right Search Box Card */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-800">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                    <i className="bi bi-search text-lg"></i>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Find Available Trains</h2>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* FROM input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        FROM
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                          <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                          placeholder="Source City"
                          value={source}
                          onChange={(e) => setSource(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* TO input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        TO
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-500">
                          <i className="bi bi-pin-map-fill"></i>
                        </div>
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                          placeholder="Destination City"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Journey Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      JOURNEY DATE
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                        <i className="bi bi-calendar-event"></i>
                      </div>
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                        value={journeyDate}
                        onChange={(e) => setJourneyDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 tracking-wide uppercase text-sm transition cursor-pointer"
                  >
                    <i className="bi bi-search"></i> Search Available Trains
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-12 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-slate-900">Popular Travel Routes</h3>
            <p className="text-slate-500 text-sm mt-1">Click any quick route to search immediately</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickRoutes.map((route, idx) => (
              <div
                key={idx}
                onClick={() =>
                  navigate(
                    `/trains?source=${encodeURIComponent(route.from)}&destination=${encodeURIComponent(
                      route.to
                    )}&date=${journeyDate}`
                  )
                }
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200 border border-slate-200/80 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-sky-600 font-bold text-sm">
                    {route.from} &rarr; {route.to}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{route.name}</div>
                </div>
                <div className="mt-3 text-right">
                  <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    Search &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
