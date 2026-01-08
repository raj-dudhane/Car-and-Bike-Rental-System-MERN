import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [dates, setDates] = useState({ startDate: '', endDate: '' });
  const [filter, setFilter] = useState('all'); // 👈 NEW: Filter State
  const navigate = useNavigate();

  // --- FETCH VEHICLES ON LOAD ---
  useEffect(() => {
    axios.get('http://localhost:5000/api/vehicles')
      .then(res => setVehicles(res.data))
      .catch(err => console.error(err));
  }, []);

  // --- BOOKING FUNCTION ---
  const handleBooking = async (vehicleId, price) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please Login to Book a Vehicle");
      navigate('/login');
      return;
    }
    if (!dates.startDate || !dates.endDate) {
      alert("Please select Start and End Date first!");
      return;
    }

    // Calculate total days
    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const totalAmount = diffDays * price;

    if(diffDays <= 0) {
        alert("End date must be after start date");
        return;
    }

    if(!window.confirm(`Confirm booking for ${diffDays} days? Total: $${totalAmount}`)) return;

    try {
      await axios.post('http://localhost:5000/api/bookings', 
        { 
          vehicle: vehicleId, 
          startDate: dates.startDate, 
          endDate: dates.endDate, 
          totalPrice: totalAmount 
        }, 
        { headers: { Authorization: token } }
      );
      alert(" Booking Successful! Check 'My History'.");
    } catch (err) {
      alert("Booking Failed: " + (err.response?.data?.error || "Unknown Error"));
    }
  };

  // --- FILTER LOGIC ---
  // If filter is 'all', show everything. Otherwise, match the 'type'.
  const filteredVehicles = filter === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.type === filter);

  return (
    <div className="container mt-4">
      
      {/* 1. HERO SECTION (Date Selection) */}
      <div className="bg-light p-5 rounded mb-4 text-center shadow-sm">
        <h1 className="display-4 fw-bold text-primary">Find Your Perfect Ride 🚀</h1>
        <p className="lead">Choose from our premium fleet of cars and bikes.</p>
        
        <div className="row justify-content-center mt-4">
          <div className="col-md-3">
            <label className="form-label fw-bold">From:</label>
            <input type="date" className="form-control" onChange={(e) => setDates({ ...dates, startDate: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold">To:</label>
            <input type="date" className="form-control" onChange={(e) => setDates({ ...dates, endDate: e.target.value })} />
          </div>
        </div>
      </div>

      {/* 2. FILTER BUTTONS (NEW) */}
      <div className="d-flex justify-content-center mb-4 gap-2">
        <button 
            className={`btn ${filter === 'all' ? 'btn-dark' : 'btn-outline-dark'}`} 
            onClick={() => setFilter('all')}
        >
            All Vehicles
        </button>
        <button 
            className={`btn ${filter === 'car' ? 'btn-primary' : 'btn-outline-primary'}`} 
            onClick={() => setFilter('car')}
        >
             Cars Only
        </button>
        <button 
            className={`btn ${filter === 'bike' ? 'btn-success' : 'btn-outline-success'}`} 
            onClick={() => setFilter('bike')}
        >
             Bikes Only
        </button>
      </div>

      {/* 3. VEHICLE GRID */}
      <div className="row">
        {filteredVehicles.length === 0 ? (
            <div className="text-center mt-5">
                <h3>No vehicles found for this category.</h3>
            </div>
        ) : (
            filteredVehicles.map((v) => (
            <div className="col-md-4 mb-4" key={v._id}>
                <div className={`card h-100 shadow border-0 ${!v.available ? 'opacity-50' : ''}`}>
                <img src={v.image} className="card-img-top" alt={v.name} style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="card-title fw-bold mb-0">{v.name}</h5>
                        <span className="badge bg-secondary text-uppercase">{v.type}</span>
                    </div>
                    
                    <h4 className="text-success">${v.price}<small className="text-muted fs-6">/day</small></h4>
                    
                    {!v.available ? (
                        <button className="btn btn-secondary w-100 mt-2" disabled>Unavailable</button>
                    ) : (
                        <button 
                            className="btn btn-primary w-100 mt-2" 
                            onClick={() => handleBooking(v._id, v.price)}
                        >
                            Book Now
                        </button>
                    )}
                </div>
                </div>
            </div>
            ))
        )}
      </div>

    </div>
  );
};

export default Home;