import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SilahLogo from './SilahLogo';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      {/* Top Left User Greeting */}
      {user && (
        <div className="nav-user-top">
          <span>Welcome, {user.name || 'Ruqaya Alsammak'}</span>
        </div>
      )}

      {/* Main Nav Bar Row */}
      <div className="nav-main">
        <div className="nav-left-group">
          <Link to="/" className="brand-logo-link">
            <SilahLogo />
          </Link>

          <div className="nav-links">
            <Link to="/rooms">Rooms</Link>
            <Link to="/my-bookings">My Bookings</Link>
          </div>
        </div>

        <div className="nav-right">
          <button type="button" className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;