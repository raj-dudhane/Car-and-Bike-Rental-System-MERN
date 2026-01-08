import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      
      alert("Login Successful!");
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || "Invalid Credentials");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto shadow p-4" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">🔑 Login</h2>
        
        <form onSubmit={handleLogin}>
          
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
            
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              
          
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Login
          </button>

        </form>

        <p className="text-center mt-3">
          New User? <a href="/register">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default Login;