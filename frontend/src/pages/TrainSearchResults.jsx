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
    <div className="container py-4">
      {/* Search Header Bar */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 bg-dark text-white p-3">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          <div className="col-md-3">
            <label className="form-label text-secondary small fw-bold mb-1">FROM</label>
            <input 
              type="text" 
              className="form-control bg-secondary text-white border-0 fw-semibold" 
              placeholder="Source City"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label text-secondary small fw-bold mb-1">TO</label>
            <input 
              type="text" 
              className="form-control bg-secondary text-white border-0 fw-semibold" 
              placeholder="Destination City"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label text-secondary small fw-bold mb-1">JOURNEY DATE</label>
            <input 
              type="date" 
              className="form-control bg-secondary text-white border-0 fw-semibold" 
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mt-4 mt-md-0 d-flex align-items-center justify-content-center gap-2">
              <i className="bi bi-search"></i> Modify Search
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
          <i className="bi bi-train-freight-front text-primary"></i>
          {trains.length} Trains Found
          {(searchParams.get('source') || searchParams.get('destination')) && (
            <span className="text-muted fs-6 fw-normal ms-2">
              for {searchParams.get('source') || 'Any'} &rarr; {searchParams.get('destination') || 'Any'} on {journeyDate}
            </span>
          )}
        </h4>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading trains...</span>
          </div>
          <p className="mt-3 text-muted fw-semibold">Searching available trains & live seat capacity...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger shadow-sm rounded-3 p-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i> {error}
        </div>
      ) : trains.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 text-center p-5 bg-light">
          <i className="bi bi-emoji-frown fs-1 text-muted mb-3 d-block"></i>
          <h4 className="fw-bold">No Trains Found</h4>
          <p className="text-muted">No trains match your search criteria. Try modifying your source or destination city.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {trains.map((train) => (
            <div key={train.id} className="card border-0 shadow-sm rounded-4 overflow-hidden hover-shadow">
              <div className="card-header bg-white border-bottom py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div className="d-flex align-items-center gap-3">
                  <span className="badge bg-dark text-white font-monospace px-3 py-2 fs-6">
                    {train.trainNumber}
                  </span>
                  <h5 className="fw-bold text-dark m-0">{train.name}</h5>
                </div>
                <div className="text-muted small">
                  Daily Express Service
                </div>
              </div>

              <div className="card-body p-4">
                {/* Timing Row */}
                <div className="row align-items-center mb-4 text-center text-md-start">
                  <div className="col-md-4 mb-2 mb-md-0">
                    <div className="fs-3 fw-bold text-dark">{train.departureTime}</div>
                    <div className="fw-semibold text-primary">{train.source}</div>
                  </div>
                  <div className="col-md-4 mb-2 mb-md-0 text-center">
                    <div className="badge bg-light text-secondary border px-3 py-1 mb-1">
                      <i className="bi bi-clock me-1"></i> {train.duration}
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 text-muted">
                      <hr className="flex-fill my-0" />
                      <i className="bi bi-train-front-fill text-primary"></i>
                      <hr className="flex-fill my-0" />
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <div className="fs-3 fw-bold text-dark">{train.arrivalTime}</div>
                    <div className="fw-semibold text-danger">{train.destination}</div>
                  </div>
                </div>

                {/* Class & Seat Availability Cards Grid */}
                <div className="row g-3">
                  {train.classes && train.classes.map((cls) => {
                    const config = CLASS_CONFIG[cls.classCode] || { label: cls.classCode };
                    const isAvailable = cls.availableSeats > 0;

                    return (
                      <div className="col-6 col-md-3" key={cls.classCode}>
                        <div className={`card h-100 border rounded-3 p-3 text-center ${isAvailable ? 'bg-light border-primary-subtle' : 'bg-light border-secondary-subtle opacity-75'}`}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold fs-5 text-dark">{cls.classCode}</span>
                            <span className="badge bg-secondary-subtle text-dark border small">{config.label}</span>
                          </div>
                          
                          <div className="fs-4 fw-extrabold text-success mb-2">
                            &#8377;{cls.price.toLocaleString('en-IN')}
                          </div>

                          <div className="mb-3">
                            {isAvailable ? (
                              <span className="badge bg-success-subtle text-success border border-success fw-bold px-2 py-1">
                                <i className="bi bi-check-circle-fill me-1"></i> {cls.availableSeats} seats available
                              </span>
                            ) : (
                              <span className="badge bg-danger-subtle text-danger border border-danger fw-bold px-2 py-1">
                                <i className="bi bi-x-circle-fill me-1"></i> Sold Out
                              </span>
                            )}
                          </div>

                          <button 
                            className={`btn w-100 fw-bold py-2 rounded-2 ${isAvailable ? 'btn-primary' : 'btn-secondaryDisabled disabled'}`}
                            onClick={() => isAvailable && handleBookClass(train.id, cls.classCode)}
                            disabled={!isAvailable}
                          >
                            {isAvailable ? 'Book' : 'Full'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
