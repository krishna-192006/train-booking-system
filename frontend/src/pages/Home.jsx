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

  const quickCities = ['Delhi', 'Lucknow', 'Mumbai', 'Jaipur', 'Kolkata', 'Bengaluru', 'Ahmedabad'];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-dark text-white py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)' }}>
        <div className="container py-4 position-relative z-1">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6">
              <span className="badge bg-primary px-3 py-2 rounded-pill mb-3 text-uppercase tracking-wider">
                <i className="bi bi-stars me-1"></i> Fast & Automatic Seat Allocation
              </span>
              <h1 className="display-4 fw-extrabold mb-3">
                Book Train Tickets <span className="text-primary">Effortlessly</span>
              </h1>
              <p className="lead text-light opacity-75 mb-4">
                Experience smart, hassle-free train booking with automatic seat allocation, instant PNR generation, and real-time status tracking.
              </p>
              
              <div className="d-flex flex-wrap gap-3">
                <div className="d-flex align-items-center gap-2 text-light opacity-90">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <span>No Clickable Seat Grids</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-light opacity-90">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <span>Instant PNR Ticket</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-light opacity-90">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <span>Double-Booking Protection</span>
                </div>
              </div>
            </div>

            {/* Search Box Card */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg bg-white text-dark rounded-4 p-4">
                <div className="card-body">
                  <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                    <i className="bi bi-search text-primary"></i> Search Trains
                  </h4>

                  <form onSubmit={handleSearch}>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted fw-semibold small">FROM</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0"><i className="bi bi-geo-alt-fill text-primary"></i></span>
                          <input 
                            type="text" 
                            className="form-control bg-light border-start-0 py-2 fw-semibold" 
                            placeholder="Source City"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted fw-semibold small">TO</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0"><i className="bi bi-pin-map-fill text-danger"></i></span>
                          <input 
                            type="text" 
                            className="form-control bg-light border-start-0 py-2 fw-semibold" 
                            placeholder="Destination City"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-muted fw-semibold small">JOURNEY DATE</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-calendar-event text-primary"></i></span>
                        <input 
                          type="date" 
                          className="form-control bg-light border-start-0 py-2 fw-semibold" 
                          value={journeyDate}
                          onChange={(e) => setJourneyDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-100 py-3 fw-bold rounded-3 text-uppercase shadow-sm d-flex align-items-center justify-content-center gap-2">
                      <i className="bi bi-search"></i> Search Available Trains
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Route Shortcuts */}
      <section className="py-5 bg-light">
        <div className="container py-2">
          <div className="text-center mb-4">
            <h3 className="fw-bold">Popular Routes</h3>
            <p className="text-muted">Click any route below to search instantly</p>
          </div>

          <div className="row g-3 justify-content-center">
            {[
              { from: 'Delhi', to: 'Lucknow', code: '12430', name: 'Rajdhani Express' },
              { from: 'Delhi', to: 'Jaipur', code: '12015', name: 'Shatabdi Express' },
              { from: 'Mumbai', to: 'Ahmedabad', code: '20901', name: 'Vande Bharat' },
              { from: 'Kolkata', to: 'Delhi', code: '12259', name: 'Duronto Express' },
              { from: 'Bengaluru', to: 'Delhi', code: '12649', name: 'Sampark Kranti' }
            ].map((route, idx) => (
              <div className="col-6 col-md-4 col-lg-2.4" key={idx}>
                <div 
                  className="card h-100 border-0 shadow-sm hover-top text-center cursor-pointer p-3 rounded-3 bg-white"
                  onClick={() => navigate(`/trains?source=${route.from}&destination=${route.to}&date=${journeyDate}`)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                >
                  <div className="text-primary fw-bold mb-1">{route.from} &rarr; {route.to}</div>
                  <div className="small text-muted">{route.name}</div>
                  <span className="badge bg-light text-dark mt-2 border">Search &rarr;</span>
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
