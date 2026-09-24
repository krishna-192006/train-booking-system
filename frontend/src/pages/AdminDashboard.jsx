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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Admin Train Control</h1>
          <p className="text-sm text-slate-500 mt-1">Configure trains, routes, coach capacities, and monitor reservation stats</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/25 transition cursor-pointer self-start sm:self-auto"
        >
          <i className="bi bi-plus-lg"></i> Add New Train
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="bi bi-check-circle-fill text-emerald-600"></i>
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage('')} className="text-emerald-800 font-bold px-2 cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill text-rose-500"></i>
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-rose-800 font-bold px-2 cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {/* Counter Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">TOTAL TRAINS</div>
            <div className="text-4xl font-black text-sky-400 mt-1">{stats.totalTrains}</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-2xl border border-sky-500/30">
            <i className="bi bi-train-front"></i>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">REGISTERED USERS</div>
            <div className="text-4xl font-black text-emerald-400 mt-1">{stats.totalUsers}</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl border border-emerald-500/30">
            <i className="bi bi-people"></i>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">TOTAL BOOKINGS</div>
            <div className="text-4xl font-black text-amber-400 mt-1">{stats.totalBookings}</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl border border-amber-500/30">
            <i className="bi bi-ticket-detailed"></i>
          </div>
        </div>
      </div>

      {/* Train Management Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Active Train Catalog</h2>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {trains.length} Trains Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Loading trains catalog...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-6 font-semibold">Train No.</th>
                  <th className="py-3 px-6 font-semibold">Train Name</th>
                  <th className="py-3 px-6 font-semibold">Route</th>
                  <th className="py-3 px-6 font-semibold">Timings</th>
                  <th className="py-3 px-6 font-semibold">Classes &amp; Fares</th>
                  <th className="py-3 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trains.map((train) => (
                  <tr key={train.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-mono font-bold text-sky-600">{train.trainNumber}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{train.name}</td>
                    <td className="py-4 px-6 text-slate-700">
                      {train.source} &rarr; {train.destination}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">{train.departureTime}</span> - {train.arrivalTime}
                      <span className="text-slate-400 block mt-0.5">({train.duration})</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {train.classes?.map((c) => (
                          <span
                            key={c.classCode}
                            className="inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {c.classCode}: &#8377;{c.price} <span className="text-slate-400 font-normal">({c.totalSeats}s)</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(train)}
                          className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 flex items-center justify-center transition cursor-pointer"
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTrain(train.id, train.name)}
                          className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition cursor-pointer"
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Train Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingTrainId ? 'Edit Train Details' : 'Add New Train'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-white hover:text-slate-300 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitTrain}>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Train Number</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                      value={trainNumber}
                      onChange={(e) => setTrainNumber(e.target.value)}
                      required
                      placeholder="e.g. 12430"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Train Name</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Rajdhani Express"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Source City</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      required
                      placeholder="Delhi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Destination City</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      placeholder="Lucknow"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Departure Time</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      required
                      placeholder="06:30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Arrival Time</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      required
                      placeholder="12:45"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Duration</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                      placeholder="6h 15m"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Class Fares &amp; Capacity
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="font-bold text-xs block text-slate-800 mb-1.5">Sleeper (SL)</span>
                      <input
                        type="number"
                        placeholder="Fare ₹"
                        className="w-full px-2 py-1 mb-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        value={slPrice}
                        onChange={(e) => setSlPrice(e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Seats"
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white"
                        value={slSeats}
                        onChange={(e) => setSlSeats(e.target.value)}
                      />
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="font-bold text-xs block text-slate-800 mb-1.5">AC 3 Tier (3A)</span>
                      <input
                        type="number"
                        placeholder="Fare ₹"
                        className="w-full px-2 py-1 mb-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        value={a3Price}
                        onChange={(e) => setA3Price(e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Seats"
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white"
                        value={a3Seats}
                        onChange={(e) => setA3Seats(e.target.value)}
                      />
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="font-bold text-xs block text-slate-800 mb-1.5">AC 2 Tier (2A)</span>
                      <input
                        type="number"
                        placeholder="Fare ₹"
                        className="w-full px-2 py-1 mb-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        value={a2Price}
                        onChange={(e) => setA2Price(e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Seats"
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white"
                        value={a2Seats}
                        onChange={(e) => setA2Seats(e.target.value)}
                      />
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="font-bold text-xs block text-slate-800 mb-1.5">AC 1st (1A)</span>
                      <input
                        type="number"
                        placeholder="Fare ₹"
                        className="w-full px-2 py-1 mb-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        value={a1Price}
                        onChange={(e) => setA1Price(e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Seats"
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white"
                        value={a1Seats}
                        onChange={(e) => setA1Seats(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-sm transition cursor-pointer"
                >
                  {editingTrainId ? 'Save Changes' : 'Create Train'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
