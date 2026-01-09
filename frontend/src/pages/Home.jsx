import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  //  1. NEW STATE FOR FILTERING
  const [filterType, setFilterType] = useState('all'); // 'all', 'car', 'bike'

  // State for Date Selection
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/vehicles');
        setVehicles(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleBooking = async (vehicle) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Please Login to Book!");
      navigate('/login');
      return;
    }

    if (!startDate || !endDate) {
      alert(" Please select BOTH Start Date and End Date at the top of the page!");
      return; 
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays < 0) {
        alert(" End date cannot be before Start date!");
        return;
    }
    if (diffDays === 0) diffDays = 1;

    const totalPrice = diffDays * vehicle.price;

    try {
      await axios.post('http://localhost:5000/api/bookings', {
        vehicle: vehicle._id,
        startDate,
        endDate,
        totalPrice
      }, {
        headers: { Authorization: token }
      });

      alert(` Booking Confirmed!\nVehicle: ${vehicle.name}\nDays: ${diffDays}\nTotal: $${totalPrice}`);
      navigate('/dashboard');
      
    } catch (err) {
      console.error("Booking Error:", err);
      const serverError = err.response?.data?.error || "Booking Failed";
      alert(" Error: " + serverError);
    }
  };

  //  2. FILTER LOGIC
  const filteredVehicles = vehicles.filter(vehicle => {
    if (filterType === 'all') return true;
    return vehicle.type === filterType;
  });

  return (
    <div className="container mt-4">
      
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Find Your Perfect Ride 🚗</h1>
        <p className="text-muted">Choose from our wide range of cars and bikes</p>
      </div>

      {/* --- DATE SELECTION BOX --- */}
      <div className="card p-4 shadow-sm mb-4 bg-light mx-auto border-primary" style={{ maxWidth: '800px', borderLeft: '5px solid #0d6efd' }}>
        <h5 className="text-center mb-3"> Step 1: Select Rental Dates</h5>
        <div className="row g-3">
            <div className="col-md-6">
                <label className="form-label fw-bold">From:</label>
                <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="col-md-6">
                <label className="form-label fw-bold">To:</label>
                <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
        </div>
      </div>

      {/* - 3. FILTER BUTTONS --- */}
      <div className="d-flex justify-content-center gap-3 mb-5">
        <button 
            className={`btn px-4 py-2 ${filterType === 'all' ? 'btn-dark' : 'btn-outline-dark'}`} 
            onClick={() => setFilterType('all')}
        >
            Show All
        </button>
        <button 
            className={`btn px-4 py-2 ${filterType === 'car' ? 'btn-primary' : 'btn-outline-primary'}`} 
            onClick={() => setFilterType('car')}
        >
             Cars Only
        </button>
        <button 
            className={`btn px-4 py-2 ${filterType === 'bike' ? 'btn-success' : 'btn-outline-success'}`} 
            onClick={() => setFilterType('bike')}
        >
             Bikes Only
        </button>
      </div>

      {/* --- VEHICLE LIST --- */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="row">
          {/* 👇 Using filteredVehicles instead of vehicles */}
          {filteredVehicles.map((vehicle) => (
            <div className="col-md-4 mb-4" key={vehicle._id}>
              <div className="card h-100 shadow border-0 hover-shadow">
                <img 
                    src={vehicle.image} 
                    className="card-img-top" 
                    alt={vehicle.name} 
                    style={{ height: '200px', objectFit: 'cover' }} 
                />
                
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{vehicle.name}</h5>
                  <p className="text-muted text-uppercase small">{vehicle.type}</p>
                  <h4 className="text-success fw-bold">${vehicle.price} <small className="text-muted fs-6">/ day</small></h4>
                  
                  {vehicle.available ? (
                      <button className="btn btn-primary w-100 mt-2" onClick={() => handleBooking(vehicle)}>
                        Book Now 
                      </button>
                  ) : (
                      <button className="btn btn-secondary w-100 mt-2" disabled>
                        Unavailable 
                      </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredVehicles.length === 0 && !loading && (
        <p className="text-center text-muted fs-5 mt-4">No {filterType}s found.</p>
      )}

    </div>
  );
};

export default Home;