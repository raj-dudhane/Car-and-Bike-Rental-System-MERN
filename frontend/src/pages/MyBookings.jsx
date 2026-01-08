import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/bookings/my', { 
        headers: { Authorization: token } 
      })
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this history?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
        headers: { Authorization: token }
      });

      // Update UI after delete
      setBookings(bookings.filter((b) => b._id !== id));
      alert(" History Deleted Successfully!");
    } catch (err) {
      alert("Error deleting booking. Check if backend is running.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Booking History</h2>
      {bookings.length === 0 ? (
        <div className="alert alert-info text-center">No bookings found.</div>
      ) : (
        <div className="row">
          {bookings.map((b) => (
            <div className="col-md-8 mx-auto mb-3" key={b._id}>
              <div className="card shadow-sm border-0">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title text-primary mb-1">
                      {b.vehicle ? b.vehicle.name : "Vehicle Removed"}
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                      {b.startDate} <span className="mx-2">to</span> {b.endDate}
                    </p>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success fs-6 mb-2">${b.totalPrice}</span>
                    <br />
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDelete(b._id)}
                    >
                      Delete
                    </button>
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

export default MyBookings;