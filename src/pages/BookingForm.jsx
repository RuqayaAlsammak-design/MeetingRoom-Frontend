import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BookingForm({ rooms = [], onSubmitBooking }) {
  const [formData, setFormData] = useState({
    roomId: '',
    title: '',
    date: '2026-10-06',
    attendees: 1,
    startTime: '09:00',
    endTime: '10:00',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitBooking) onSubmitBooking(formData);
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div style={styles.headerArea}>
          <Link to="/rooms" style={styles.backLink}>
            &larr; Back to Rooms
          </Link>
          <h1 style={styles.heading}>Book a Meeting Room</h1>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="roomId">Room</label>
            <select 
              id="roomId"
              name="roomId" 
              value={formData.roomId} 
              onChange={handleChange}
              required
            >
              <option value="">Select a room...</option>
              {rooms.map((room) => (
                <option key={room._id || room.id} value={room._id || room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="title">Meeting Title</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Enter meeting title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="attendees">Attendees</label>
              <input
                id="attendees"
                type="number"
                name="attendees"
                min="1"
                value={formData.attendees}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label htmlFor="startTime">Start Time</label>
              <input
                id="startTime"
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="endTime">End Time</label>
              <input
                id="endTime"
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={styles.submitBtn}>
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    maxWidth: '680px',
    margin: '40px auto',
    padding: '0 20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '36px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0',
  },
  headerArea: {
    marginBottom: '28px',
  },
  backLink: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
    display: 'inline-block',
    marginBottom: '12px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1d3567',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  submitBtn: {
    marginTop: '12px',
    padding: '12px',
    fontSize: '15px',
    width: '100%',
  },
};