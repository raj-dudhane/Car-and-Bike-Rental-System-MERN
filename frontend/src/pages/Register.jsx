import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  
  
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Form Data:", formData); 

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log("Server Response:", res.data);
      
      alert("✅ Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      console.error("Registration Error:", err);
    
      const errorMessage = err.response?.data?.error || "Registration Failed. Check Backend.";
      alert(" Error: " + errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto shadow p-4" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">📝 Register</h2>
        
        <form onSubmit={handleSubmit}>
          
          {/* Name Input */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="name" 
              className="form-control" 
              value={formData.name}       
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Email Input */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="form-control" 
              value={formData.email}      
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Password Input  */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                className="form-control" 
                value={formData.password}  
                onChange={handleChange} 
                required 
              />
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Register New User
          </button>

        </form>
        
        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;