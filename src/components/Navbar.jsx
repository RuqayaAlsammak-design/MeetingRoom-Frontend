// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import silahLogo from '../assets/silah-logo.png';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/dashboard" style={styles.brandLink}>
          <img 
            src={silahLogo} 
            alt="Silah Logo" 
            style={styles.logo} 
          />
          <span style={styles.brandTitle}>MeetingRooms</span>
        </Link>

        <nav style={styles.nav}>
          <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          <Link to="/rooms" style={styles.navLink}>Rooms</Link>
          <Link to="/my-bookings" style={styles.navLink}>My Bookings</Link>
          <button 
            onClick={() => { onLogout(); navigate('/login'); }} 
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '68px',
    display: 'flex',
    alignItems: 'center',
    justify: 'space-between',
  },
  brandLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
  },
  logo: {
    height: '32px',
    width: 'auto',
    objectFit: 'contain',
  },
  brandTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1d3567',
    letterSpacing: '-0.3px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#dc2626',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '6px 12px',
  },
};