import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow">
      <Link className="navbar-brand" to="/">🚀 RentalPro</Link>
      <div className="ms-auto">
        {user ? (
          <>
            <span className="text-light me-3">Welcome, {user.name}</span>
            <Link className="btn btn-outline-light me-2" to="/bookings">My History</Link>
            {user.role === 'admin' && <Link className="btn btn-warning me-2" to="/admin">Admin</Link>}
            <button className="btn btn-danger" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link className="btn btn-custom px-4" to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};
export default Navbar;