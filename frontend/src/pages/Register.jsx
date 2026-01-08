import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || "Registration Failed");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-5 shadow" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label>Name</label>
            <input 
              className="form-control" 
              placeholder="Enter your name" 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              required
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input 
              className="form-control" 
              placeholder="Enter email" 
              onChange={e => setForm({ ...form, email: e.target.value })} 
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter password" 
              onChange={e => setForm({ ...form, password: e.target.value })} 
              required
            />
          </div>
          <button className="btn btn-custom w-100 text-white" style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}>
            Sign Up
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;