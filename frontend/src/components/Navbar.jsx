import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow-sm">
      <div className="container-fluid">
        {/* LOGO */}
        <Link className="navbar-brand fw-bold fs-3" to="/">🚀 RentalPro</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>

            {!user ? (
              // IF NOT LOGGED IN
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light text-primary fw-bold ms-2" to="/register">Register</Link>
                </li>
              </>
            ) : (
              // IF LOGGED IN (Everything in one line)
              <div className="d-flex align-items-center gap-3 ms-3 bg-white bg-opacity-10 p-2 rounded">
                
                {/* 1. Welcome Text */}
                <span className="text-white fw-light">
                    Welcome, <strong>{user.name}</strong>
                </span>

                {/* 2. Dashboard Link */}
                <Link className="btn btn-sm btn-outline-light border-0" to="/dashboard">
                    📊 Dashboard
                </Link>

                {/* 3. Admin Button (Only if admin) */}
                {user.role === 'admin' && (
                  <Link className="btn btn-sm btn-warning fw-bold text-dark" to="/admin">
                    Admin
                  </Link>
                )}

                {/* 4. Logout Button */}
                <button className="btn btn-sm btn-danger" onClick={handleLogout}>
                   Logout
                </button>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;