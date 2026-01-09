import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [form, setForm] = useState({ name: '', type: 'car', price: '', image: '' });
  const [editingId, setEditingId] = useState(null); 

  const [allBookings, setAllBookings] = useState([]); 
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]); 

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: token } };

      const [resBookings, resVehicles, resUsers] = await Promise.all([
        axios.get('http://localhost:5000/api/bookings/all', config),
        axios.get('http://localhost:5000/api/vehicles'),
        axios.get('http://localhost:5000/api/auth/users', config)
      ]);

      setAllBookings(resBookings.data);
      setVehicles(resVehicles.data);
      setUsers(resUsers.data);
    } catch (err) { console.error("Error loading data"); }
  };

  // --- ACTIONS ---

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/vehicles/edit/${editingId}`, form, { headers: { Authorization: token } });
        setEditingId(null); 
        alert("✅ Vehicle Updated!");
      } else {
        await axios.post('http://localhost:5000/api/vehicles', form, { headers: { Authorization: token } });
        alert("✅ Vehicle Added!");
      }
      setForm({ name: '', type: 'car', price: '', image: '' });
      fetchData(); 
    } catch (err) { alert("Operation failed"); }
  };

  const handleEditClick = (v) => {
    setForm({ name: v.name, type: v.type, price: v.price, image: v.image });
    setEditingId(v._id);
    window.scrollTo(0,0);
  };

  // 👇 NEW: Cancel Button Function
  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: '', type: 'car', price: '', image: '' });
  };

  const handleToggle = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/vehicles/status/${id}`, {}, { headers: { Authorization: token } });
        fetchData(); 
    } catch (err) { alert("Failed to change status"); }
  };

  const deleteVehicle = async (id) => {
    if(!window.confirm("Delete this vehicle?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`, { headers: { Authorization: token } });
      fetchData();
    } catch (err) { alert("Error deleting"); }
  };

  const deleteUser = async (id) => {
    if(!window.confirm("Delete user?")) return;
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/auth/users/${id}`, { headers: { Authorization: token } });
        fetchData();
    } catch (err) { alert("Failed to delete user"); }
  };

  return (
    <div className="container mt-4">
      
      {/* 1. VEHICLE FORM */}
      <div className="card p-4 shadow mb-5 mx-auto" style={{maxWidth: '800px', borderTop: editingId ? '5px solid #ffc107' : '5px solid #198754'}}>
        <h3 className="text-center mb-4">{editingId ? "✏️ Edit Vehicle" : "➕ Add Vehicle"}</h3>
        <div className="row">
          <div className="col-md-6 mb-3"><input className="form-control" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /></div>
          <div className="col-md-6 mb-3"><select className="form-select" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}><option value="car">Car</option><option value="bike">Bike</option></select></div>
          <div className="col-md-6 mb-3"><input type="number" className="form-control" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} /></div>
          <div className="col-md-6 mb-3"><input className="form-control" placeholder="Image URL" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} /></div>
        </div>
        
        <div className="d-flex gap-2">
            <button className={`btn w-100 ${editingId ? 'btn-warning' : 'btn-success'}`} onClick={handleSubmit}>
                {editingId ? "Update Vehicle" : "Add Vehicle"}
            </button>
            
            {/* 👇 CANCEL BUTTON (Only shows when editing) */}
            {editingId && (
                <button className="btn btn-secondary w-50" onClick={handleCancel}>
                    ❌ Cancel
                </button>
            )}
        </div>
      </div>

      {/* 2. LISTS */}
      <div className="row">
         <div className="col-md-6 mb-4">
             <h4 className="text-center">👥 Users</h4>
             <ul className="list-group shadow">
                {users.map(u => (
                    <li key={u._id} className="list-group-item d-flex justify-content-between">
                        {u.name} 
                        <button className="btn btn-sm btn-danger" onClick={()=>deleteUser(u._id)}>Delete</button>
                    </li>
                ))}
             </ul>
         </div>

         <div className="col-md-6 mb-4">
             <h4 className="text-center">🚗 Fleet</h4>
             <ul className="list-group shadow">
                {vehicles.map(v => (
                    <li key={v._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{v.name}</strong> 
                            <span className={`badge ms-2 ${v.available ? 'bg-success' : 'bg-danger'}`}>
                                {v.available ? "Active" : "Disabled"}
                            </span>
                            <br/>
                            <small className="text-muted">${v.price}/day</small>
                        </div>
                        <div>
                            <button className={`btn btn-sm me-1 ${v.available ? 'btn-warning' : 'btn-success'}`} onClick={() => handleToggle(v._id)}>
                                {v.available ? "Disable" : "Enable"}
                            </button>
                            <button className="btn btn-sm btn-primary me-1" onClick={() => handleEditClick(v)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={()=>deleteVehicle(v._id)}>Del</button>
                        </div>
                    </li>
                ))}
             </ul>
         </div>
      </div>

      {/* 3. BOOKING HISTORY */}
      <h3 className="text-center mb-3">🗂️ Booking History</h3>
      <div className="table-responsive shadow rounded mb-5">
        <table className="table table-bordered mb-0 bg-white align-middle">
          <thead className="table-dark"><tr><th>User</th><th>Vehicle</th><th>Dates</th><th>Price</th></tr></thead>
          <tbody>
            {allBookings.map((b) => (
              <tr key={b._id}>
                <td>{b.user ? b.user.name : "Unknown"}</td>
                <td>{b.vehicle ? b.vehicle.name : "Removed"}</td>
                <td><small>{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</small></td>
                <td className="text-success fw-bold">${b.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;