import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      try {
        setLoading(true);
        // Get Profile & Bookings
        const [resUser, resBookings] = await Promise.all([
            axios.get('http://localhost:5000/api/auth/profile', { headers: { Authorization: token } }),
            axios.get('http://localhost:5000/api/bookings/my', { headers: { Authorization: token } })
        ]);

        setUser(resUser.data);
        setBookings(resBookings.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
        if(err.response?.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleDelete = async (id) => {
    if(!window.confirm("Cancel this booking?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/bookings/${id}`, { headers: { Authorization: token } });
      setBookings(bookings.filter(b => b._id !== id));
      alert("✅ Booking Cancelled");
    } catch (err) { alert("Failed to cancel"); }
  };

  // Helper for dates
  const getStatus = (end) => new Date(end) >= new Date().setHours(0,0,0,0) ? "Active" : "Completed";

  return (
    <div className="container mt-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👤 My Dashboard</h2>
        <div className="btn-group shadow-sm">
            <button className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('bookings')}>My Bookings</button>
            <button className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('profile')}>My Profile</button>
        </div>
      </div>

      {/* CONTENT BOX */}
      <div className="card shadow p-4" style={{ minHeight: '300px' }}>
        
        {loading && <div className="text-center py-5"><div className="spinner-border text-primary"></div><p>Loading...</p></div>}
        
        {!loading && error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
            <>
                {activeTab === 'bookings' && (
                    <div>
                        {bookings.length === 0 ? <p className="alert alert-info">No bookings found.</p> : (
                            <table className="table table-hover align-middle">
                                <thead className="table-light"><tr><th>Vehicle</th><th>Dates</th><th>Price</th><th>Status</th><th>Action</th></tr></thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b._id}>
                                            <td><strong>{b.vehicle?.name || "Unknown"}</strong></td>
                                            <td><small>{b.startDate?.split('T')[0]} ➝ {b.endDate?.split('T')[0]}</small></td>
                                            <td className="fw-bold text-success">${b.totalPrice}</td>
                                            <td><span className={`badge ${getStatus(b.endDate) === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{getStatus(b.endDate)}</span></td>
                                            <td>{getStatus(b.endDate) === 'Active' && <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b._id)}>Cancel</button>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && user && (
                    <div className="text-center">
                        <div className="bg-light d-inline-block rounded-circle p-4 mb-3" style={{fontSize: '40px'}}>👤</div>
                        <h3>{user.name}</h3>
                        <p className="text-muted">{user.email}</p>
                        <span className="badge bg-info text-dark">{user.role} Account</span>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;