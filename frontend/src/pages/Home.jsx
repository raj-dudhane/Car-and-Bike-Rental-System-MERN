import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = ({ user }) => {
  const [vehicles, setVehicles] = useState([]);
  const [dates, setDates] = useState({ start: '', end: '' });

  useEffect(() => {
    // Fetch vehicles from backend
    axios.get('http://localhost:5000/api/vehicles')
      .then(res => setVehicles(res.data))
      .catch(err => console.log("Error fetching vehicles:", err));
  }, []);


  const handleSetDates = () => {
    if (!dates.start || !dates.end) {
      alert("Please select both Pickup and Return dates.");
      return;
    }
  
    alert(`Dates confirmed: ${dates.start} to ${dates.end}. Now choose a vehicle below!`);
    
    
    const fleetSection = document.getElementById('fleet-section');
    if (fleetSection) {
      fleetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBook = async (vehicle) => {
    if (!user) return alert("Please Login First to Book!");
    if (!dates.start || !dates.end) return alert("Please click 'Set' to confirm your dates first.");

    
    const startDate = new Date(dates.start);
    const endDate = new Date(dates.end);
    const diffTime = Math.abs(endDate - startDate);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (days <= 0) return alert("Invalid date range (Return date must be after Pickup date)");

    const totalPrice = days * vehicle.price;

    if (window.confirm(`Rent ${vehicle.name} for ${days} days?\nTotal Price: $${totalPrice}`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/bookings', {
          vehicle: vehicle._id, 
          startDate: dates.start, 
          endDate: dates.end, 
          totalPrice
        }, { headers: { Authorization: token } });
        
        alert(" Booking Successful! Check 'My History'.");
      } catch (err) {
        alert("Booking Failed. Please try again.");
      }
    }
  };

  return (
    <div>
      {/* Creative Hero Section */}
      <div className="hero-section">
        <h1 className="display-4 fw-bold">Find Your Drive.</h1>
        <p className="lead">Rent luxury cars and bikes at affordable prices.</p>
        
        <div className="container bg-white text-dark p-4 rounded shadow mt-4" style={{maxWidth:'800px'}}>
            <div className="row">
                <div className="col-md-5">
                    <label className="fw-bold">Pickup Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      onChange={e => setDates({...dates, start:e.target.value})} 
                    />
                </div>
                <div className="col-md-5">
                    <label className="fw-bold">Return Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      onChange={e => setDates({...dates, end:e.target.value})} 
                    />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                    {/* ADDED ONCLICK EVENT HERE */}
                    <button className="btn btn-dark w-100" onClick={handleSetDates}>Set</button>
                </div>
            </div>
        </div>
      </div>

      {/* Vehicle Cards */}
      <div className="container pb-5" id="fleet-section">
        <h3 className="mb-4 text-center">Available Fleet</h3>
        
        {vehicles.length === 0 ? (
          <p className="text-center">Loading vehicles or no vehicles available...</p>
        ) : (
          <div className="row">
            {vehicles.map(v => (
              <div className="col-md-4 mb-4" key={v._id}>
                <div className="card vehicle-card h-100 shadow-sm">
                  <img src={v.image} className="card-img-top" style={{height:'220px', objectFit:'cover'}} alt={v.name} />
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">{v.name}</h5>
                    <span className={`badge ${v.type === 'car' ? 'bg-primary' : 'bg-success'} mb-2`}>
                      {v.type.toUpperCase()}
                    </span>
                    <h4 className="text-primary">${v.price} <small className="text-muted fs-6">/ day</small></h4>
                    <button className="btn btn-custom w-100 mt-2" onClick={() => handleBook(v)}>Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;