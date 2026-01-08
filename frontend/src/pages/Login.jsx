import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/');
    } catch(err) { alert("Login Failed"); }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-5 shadow" style={{width: '400px'}}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <input className="form-control mb-3" placeholder="Email" onChange={e=>setForm({...form, email:e.target.value})} />
          <input className="form-control mb-3" type="password" placeholder="Password" onChange={e=>setForm({...form, password:e.target.value})} />
          <button className="btn btn-custom w-100">Login</button>
        </form>
        <p className="text-center mt-3"><Link to="/register">Create Account</Link></p>
      </div>
    </div>
  );
};
export default Login;