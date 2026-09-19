import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AdminDashboard = () => {
  const [trains, setTrains] = useState([]);
  const [stats, setStats] = useState({ totalTrains: 0, totalUsers: 0, totalBookings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTrainId, setEditingTrainId] = useState(null);

  // Form State
  const [trainNumber, setTrainNumber] = useState('');
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [duration, setDuration] = useState('');

  // Class configs
  const [slPrice, setSlPrice] = useState(650);
  const [slSeats, setSlSeats] = useState(72);
  const [a3Price, setA3Price] = useState(1250);
  const [a3Seats, setA3Seats] = useState(72);
  const [a2Price, setA2Price] = useState(1850);
  const [a2Seats, setA2Seats] = useState(48);
  const [a1Price, setA1Price] = useState(3200);
  const [a1Seats, setA1Seats] = useState(24);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [trainsRes, statsRes] = await Promise.all([
        axiosInstance.get('/admin/trains'),
        axiosInstance.get('/admin/stats')
      ]);
      setTrains(trainsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to fetch admin dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const openAddModal = () => {
    setEditingTrainId(null);
    setTrainNumber('');
    setName('');
    setSource('');
    setDestination('');
    setDepartureTime('08:00');
    setArrivalTime('14:00');
    setDuration('6h 00m');
    setSlPrice(650); setSlSeats(72);
    setA3Price(1250); setA3Seats(72);
    setA2Price(1850); setA2Seats(48);
    setA1Price(3200); setA1Seats(24);
    setShowModal(true);
  };

  const openEditModal = (train) => {
    setEditingTrainId(train.id);
    setTrainNumber(train.trainNumber);
    setName(train.name);
    setSource(train.source);
    setDestination(train.destination);
    setDepartureTime(train.departureTime);
    setArrivalTime(train.arrivalTime);
    setDuration(train.duration);

    // Map existing classes
    const sl = train.classes?.find(c => c.classCode === 'SL');
    if (sl) { setSlPrice(sl.price); setSlSeats(sl.totalSeats); }
    const a3 = train.classes?.find(c => c.classCode === '3A');
    if (a3) { setA3Price(a3.price); setA3Seats(a3.totalSeats); }
    const a2 = train.classes?.find(c => c.classCode === '2A');
    if (a2) { setA2Price(a2.price); setA2Seats(a2.totalSeats); }
    const a1 = train.classes?.find(c => c.classCode === '1A');
    if (a1) { setA1Price(a1.price); setA1Seats(a1.totalSeats); }

    setShowModal(true);
  };

  const handleSubmitTrain = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const payload = {
      trainNumber,
      name,
      source,
      destination,
      departureTime,
      arrivalTime,
      duration,
      classes: [
        { classCode: 'SL', price: Number(slPrice), totalSeats: Number(slSeats) },
        { classCode: '3A', price: Number(a3Price), totalSeats: Number(a3Seats) },
        { classCode: '2A', price: Number(a2Price), totalSeats: Number(a2Seats) },
        { classCode: '1A', price: Number(a1Price), totalSeats: Number(a1Seats) }
      ]
    };

    try {
      if (editingTrainId) {
        await axiosInstance.put(`/admin/trains/${editingTrainId}`, payload);
        setMessage('Train updated successfully!');
      } else {
        await axiosInstance.post('/admin/trains', payload);
        setMessage('New train added successfully!');
      }
      setShowModal(false);
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDeleteTrain = async (id, trainName) => {
    if (!window.confirm(`Are you sure you want to delete train: ${trainName}?`)) return;
    try {
      await axiosInstance.delete(`/admin/trains/${id}`);
      setMessage(`Train ${trainName} deleted successfully.`);
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete train.');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-extrabold text-dark m-0">Admin Dashboard</h2>
          <p className="text-muted m-0">Manage trains, configure coach fares & monitor system stats</p>
        </div>
        <button className="btn btn-primary fw-bold rounded-pill px-4" onClick={openAddModal}>
          <i className="bi bi-plus-lg me-1"></i> Add New Train
        </button>
      </div>

      {message && (
        <div className="alert alert-success alert-dismissible fade show rounded-3" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show rounded-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Counter Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-dark text-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-secondary small fw-bold text-uppercase">Total Trains</div>
                <div className="display-5 fw-extrabold text-primary">{stats.totalTrains}</div>
              </div>
              <i className="bi bi-train-front fs-1 text-primary"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-dark text-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-secondary small fw-bold text-uppercase">Registered Users</div>
                <div className="display-5 fw-extrabold text-success">{stats.totalUsers}</div>
              </div>
              <i className="bi bi-people fs-1 text-success"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-dark text-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-secondary small fw-bold text-uppercase">Total Bookings</div>
                <div className="display-5 fw-extrabold text-warning">{stats.totalBookings}</div>
              </div>
              <i className="bi bi-ticket-detailed fs-1 text-warning"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Train Management Table Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold m-0 text-dark">Active Train Catalog</h5>
          <span className="badge bg-secondary">{trains.length} Trains</span>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading trains...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Train No.</th>
                    <th>Train Name</th>
                    <th>Source &rarr; Destination</th>
                    <th>Timing (Dep - Arr)</th>
                    <th>Classes &amp; Fares</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trains.map((train) => (
                    <tr key={train.id}>
                      <td className="fw-bold font-monospace text-primary">{train.trainNumber}</td>
                      <td className="fw-bold text-dark">{train.name}</td>
                      <td>{train.source} &rarr; {train.destination}</td>
                      <td className="small">{train.departureTime} - {train.arrivalTime} ({train.duration})</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {train.classes?.map((c) => (
                            <span key={c.classCode} className="badge bg-light text-dark border small">
                              {c.classCode}: &#8377;{c.price} ({c.totalSeats}s)
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" onClick={() => openEditModal(train)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-outline-danger" onClick={() => handleDeleteTrain(train.id, train.name)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block tab-modal-backdrop" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  {editingTrainId ? 'Edit Train Details' : 'Add New Train'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmitTrain}>
                <div className="modal-body p-4">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Train Number</label>
                      <input type="text" className="form-control" value={trainNumber} onChange={(e) => setTrainNumber(e.target.value)} required placeholder="e.g. 12430" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Train Name</label>
                      <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Rajdhani Express" />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Source City</label>
                      <input type="text" className="form-control" value={source} onChange={(e) => setSource(e.target.value)} required placeholder="e.g. Delhi" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Destination City</label>
                      <input type="text" className="form-control" value={destination} onChange={(e) => setDestination(e.target.value)} required placeholder="e.g. Lucknow" />
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Departure Time</label>
                      <input type="text" className="form-control" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required placeholder="06:30" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Arrival Time</label>
                      <input type="text" className="form-control" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} required placeholder="12:45" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Duration</label>
                      <input type="text" className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} required placeholder="6h 15m" />
                    </div>
                  </div>

                  <h6 className="fw-bold mb-3 border-bottom pb-2">Class Fares &amp; Total Capacity Configuration</h6>
                  <div className="row g-3">
                    <div className="col-6 col-md-3">
                      <div className="bg-light p-2 border rounded">
                        <span className="fw-bold d-block mb-1">Sleeper (SL)</span>
                        <input type="number" className="form-control form-control-sm mb-1" placeholder="Fare &#8377;" value={slPrice} onChange={(e) => setSlPrice(e.target.value)} />
                        <input type="number" className="form-control form-control-sm" placeholder="Seats" value={slSeats} onChange={(e) => setSlSeats(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="bg-light p-2 border rounded">
                        <span className="fw-bold d-block mb-1">AC 3 Tier (3A)</span>
                        <input type="number" className="form-control form-control-sm mb-1" placeholder="Fare &#8377;" value={a3Price} onChange={(e) => setA3Price(e.target.value)} />
                        <input type="number" className="form-control form-control-sm" placeholder="Seats" value={a3Seats} onChange={(e) => setA3Seats(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="bg-light p-2 border rounded">
                        <span className="fw-bold d-block mb-1">AC 2 Tier (2A)</span>
                        <input type="number" className="form-control form-control-sm mb-1" placeholder="Fare &#8377;" value={a2Price} onChange={(e) => setA2Price(e.target.value)} />
                        <input type="number" className="form-control form-control-sm" placeholder="Seats" value={a2Seats} onChange={(e) => setA2Seats(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="bg-light p-2 border rounded">
                        <span className="fw-bold d-block mb-1">AC 1st Class (1A)</span>
                        <input type="number" className="form-control form-control-sm mb-1" placeholder="Fare &#8377;" value={a1Price} onChange={(e) => setA1Price(e.target.value)} />
                        <input type="number" className="form-control form-control-sm" placeholder="Seats" value={a1Seats} onChange={(e) => setA1Seats(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold">
                    {editingTrainId ? 'Save Changes' : 'Create Train'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
