import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [form, setForm] = useState({ name: '', type: 'car', price: '', image: '' });
  const [allBookings, setAllBookings] = useState([]); 
  const [vehicles, setVehicles] = useState([]); // 

// --- FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // 1. Get Bookings
        const resBookings = await axios.get('http://localhost:5000/api/bookings/all', {
          headers: { Authorization: token }
        });
        setAllBookings(resBookings.data);

        // 2. Get Vehicles (For Availability Management)
        const resVehicles = await axios.get('http://localhost:5000/api/vehicles');
        setVehicles(resVehicles.data);

      } catch (err) {
        console.error("Error loading admin data", err);
      }
    };
    fetchData();
  }, []);

  // --- ADD VEHICLE FUNCTION ---
  const addVehicle = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/vehicles', form, { 
        headers: { Authorization: token } 
      });
      alert("✅ Vehicle Added!");
      setForm({ name: '', type: 'car', price: '', image: '' });
      
      // Refresh list
      const res = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(res.data);
    } catch (err) {
      alert("Failed to add vehicle");
    }
  };

  // --- NEW: TOGGLE AVAILABILITY FUNCTION ---
  const handleToggle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/vehicles/${id}`, {}, {
        headers: { Authorization: token }
      });
      
      // Update UI instantly
      setVehicles(vehicles.map(v => 
        v._id === id ? { ...v, available: !v.available } : v
      ));
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="container mt-4">
      
      {/* 1. ADD VEHICLE FORM */}
      <div className="card p-4 shadow mb-5 mx-auto" style={{maxWidth: '800px'}}>
        <h3 className="text-center text-primary mb-4">Add Vehicle</h3>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input className="form-control" placeholder="Vehicle Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          </div>
          <div className="col-md-6 mb-3">
            <select className="form-select" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <input type="number" className="form-control" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
          </div>
          <div className="col-md-6 mb-3">
            <input className="form-control" placeholder="Image URL" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} />
          </div>
        </div>
        <button className="btn btn-success w-100" onClick={addVehicle}>Add to Fleet</button>
      </div>

      {/* 2. MANAGE AVAILABILITY (NEW SECTION) */}
      <h3 className="text-center mb-3">🚗 Manage Fleet Availability</h3>
      <div className="table-responsive shadow rounded mb-5">
        <table className="table table-bordered mb-0 bg-white text-center">
          <thead className="table-secondary">
            <tr>
              <th>Vehicle</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.type}</td>
                <td>
                  <span className={`badge ${v.available ? 'bg-success' : 'bg-danger'}`}>
                    {v.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td>
                  <button 
                    className={`btn btn-sm ${v.available ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => handleToggle(v._id)}
                  >
                    {v.available ? "Mark Unavailable" : "Mark Available"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  VIEW ALL BOOKINGS */}
      <h3 className="text-center mb-3">🗂️ All Bookings</h3>
      <div className="table-responsive shadow rounded">
        <table className="table table-bordered mb-0 bg-white">
          <thead className="table-dark">
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {allBookings.map((b) => (
              <tr key={b._id}>
                <td><small>{b._id}</small></td>
                <td>{b.user ? b.user.name : "Unknown"}</td>
                <td>{b.vehicle ? b.vehicle.name : "Removed"}</td>
                <td>${b.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Admin;