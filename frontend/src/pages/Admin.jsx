import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [form, setForm] = useState({ name: '', type: 'car', price: '', image: '' });
  const [allBookings, setAllBookings] = useState([]); 
  const [vehicles, setVehicles] = useState([]);
  
  const [editingId, setEditingId] = useState(null); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const resBookings = await axios.get('http://localhost:5000/api/bookings/all', {
        headers: { Authorization: token }
      });
      setAllBookings(resBookings.data);

      const resVehicles = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(resVehicles.data);
    } catch (err) {
      console.error("Error loading data");
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/vehicles/edit/${editingId}`, form, {
          headers: { Authorization: token }
        });
        alert("✅ Vehicle Updated Successfully!");
        setEditingId(null); 
      } else {
        await axios.post('http://localhost:5000/api/vehicles', form, { 
          headers: { Authorization: token } 
        });
        alert("✅ Vehicle Added Successfully!");
      }

      setForm({ name: '', type: 'car', price: '', image: '' });
      fetchData(); 

    } catch (err) {
      alert("Operation failed");
    }
  };

  const handleEditClick = (vehicle) => {
    setForm({
        name: vehicle.name,
        type: vehicle.type,
        price: vehicle.price,
        image: vehicle.image
    });
    setEditingId(vehicle._id); 
    
    window.scrollTo(0, 0); 
  };

  const cancelEdit = () => {
    setForm({ name: '', type: 'car', price: '', image: '' });
    setEditingId(null);
  };

  const deleteVehicle = async (id) => {
    if(!window.confirm("Delete this vehicle?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`, { headers: { Authorization: token } });
      setVehicles(vehicles.filter(v => v._id !== id));
    } catch (err) { alert("Error deleting"); }
  };

  const handleToggle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/vehicles/${id}`, {}, { headers: { Authorization: token } });
      fetchData(); 
    } catch (err) { alert("Error updating status"); }
  };

  return (
    <div className="container mt-4">
      
      <div className="card p-4 shadow mb-5 mx-auto" style={{maxWidth: '800px', borderTop: editingId ? '5px solid #ffc107' : '5px solid #198754'}}>
        <h3 className="text-center mb-4">
            {editingId ? "✏️ Edit Vehicle" : "➕ Add New Vehicle"}
        </h3>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Vehicle Name</label>
            <input className="form-control" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Type</label>
            <select className="form-select" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label>Price per Day ($)</label>
            <input type="number" className="form-control" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Image URL</label>
            <input className="form-control" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} />
          </div>
        </div>

        <div className="d-flex gap-2">
            <button className={`btn w-100 ${editingId ? 'btn-warning' : 'btn-success'}`} onClick={handleSubmit}>
                {editingId ? "Update Vehicle" : "Add to Fleet"}
            </button>
            
            {editingId && (
                <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
            )}
        </div>
      </div>

      <h3 className="text-center mb-3">🚗 Manage Fleet</h3>
      <div className="table-responsive shadow rounded mb-5">
        <table className="table table-bordered mb-0 bg-white text-center align-middle">
          <thead className="table-secondary">
            <tr>
              <th>Image</th>
              <th>Details</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v._id}>
                <td><img src={v.image} alt={v.name} style={{width:'80px', height:'50px', objectFit:'cover', borderRadius:'5px'}} /></td>
                <td className="fw-bold text-start ps-4">{v.name} <br/> <small className="text-muted text-uppercase">{v.type}</small></td>
                <td className="text-success fw-bold">${v.price}</td>
                <td>
                  <span className={`badge ${v.available ? 'bg-success' : 'bg-danger'}`}>
                    {v.available ? "Active" : "Disabled"}
                  </span>
                </td>
                <td>
                  {/* BUTTON CHANGED HERE */}
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditClick(v)}>
                    Update Vehicle
                  </button>

                  <button 
                    className={`btn btn-sm me-2 ${v.available ? 'btn-warning' : 'btn-info'}`}
                    onClick={() => handleToggle(v._id)}
                  >
                    {v.available ? "Disable" : "Enable"}
                  </button>

                  <button className="btn btn-sm btn-danger" onClick={() => deleteVehicle(v._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-center mb-3">🗂️ Booking Log</h3>
      <div className="table-responsive shadow rounded">
        <table className="table table-bordered mb-0 bg-white">
          <thead className="table-dark">
            <tr><th>ID</th><th>User</th><th>Vehicle</th><th>Dates</th><th>Price</th></tr>
          </thead>
          <tbody>
            {allBookings.map((b) => (
              <tr key={b._id}>
                <td><small>{b._id.substring(0,8)}...</small></td>
                <td>{b.user ? b.user.name : "Unknown"}</td>
                <td>{b.vehicle ? b.vehicle.name : "Removed"}</td>
                <td><small>{b.startDate} to {b.endDate}</small></td>
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