import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      try {
        setLoading(true);
        const [resUser, resBookings] = await Promise.all([
            axios.get('http://localhost:5000/api/auth/profile', { headers: { Authorization: token } }),
            axios.get('http://localhost:5000/api/bookings/my', { headers: { Authorization: token } })
        ]);
        setUser(resUser.data);
        setBookings(resBookings.data);
      } catch (err) {
        if(err.response?.status === 401) { localStorage.removeItem('token'); navigate('/login'); }
      } finally { setLoading(false); }
    };
    fetchData();
  }, [navigate]);

  // 👇 DIRECT STATUS CHECK (Active vs Completed)
  const getStatus = (b) => {
    const end = new Date(b.endDate);
    return end >= new Date().setHours(0,0,0,0) ? "Active" : "Completed";
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Cancel booking?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/bookings/${id}`, { headers: { Authorization: token } });
      setBookings(bookings.filter(b => b._id !== id));
      alert("Cancelled");
    } catch (err) { alert("Failed"); }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <h2>👤 Dashboard</h2>
        <div className="btn-group">
            <button className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('bookings')}>My Bookings</button>
            <button className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('profile')}>My Profile</button>
        </div>
      </div>

      <div className="card shadow p-4" style={{ minHeight: '300px' }}>
        {loading ? <p className="text-center">Loading...</p> : (
            <>
                {activeTab === 'bookings' && (
                    <table className="table align-middle">
                        <thead className="table-light"><tr><th>Vehicle</th><th>Dates</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                            {bookings.map(b => {
                                const status = getStatus(b);
                                return (
                                    <tr key={b._id}>
                                        <td><strong>{b.vehicle?.name}</strong></td>
                                        <td><small>{b.startDate?.split('T')[0]} ➝ {b.endDate?.split('T')[0]}</small></td>
                                        <td>
                                            <span className={`badge ${status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{status}</span>
                                        </td>
                                        <td>{status === 'Active' && <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b._id)}>Cancel</button>}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
                {activeTab === 'profile' && user && (
                    <div className="text-center">
                        <h3>{user.name}</h3><p>{user.email}</p>
                        <button className="btn btn-danger" onClick={()=>{localStorage.clear(); navigate('/login');}}>Logout</button>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;