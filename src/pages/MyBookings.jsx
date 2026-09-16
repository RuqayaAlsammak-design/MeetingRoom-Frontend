import { useState, useEffect } from 'react';
import API from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [isOutlookConnected, setIsOutlookConnected] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Check URL parameters to see if user just returned from Microsoft OAuth login
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('sync') === 'success') {
      setIsOutlookConnected(true);
      setMessage('Successfully connected to Outlook Calendar!');
    }
  }, []);

  const handleConnectOutlook = () => {
    window.location.href = 'http://localhost:5000/api/auth/microsoft';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.delete(`/bookings/${id}`);
      setMessage('Booking canceled successfully.');
      fetchBookings();
    } catch (err) {
      setMessage('Failed to delete booking.');
    }
  };

  const startEditing = (booking) => {
    setEditingBooking(booking);
    setEditDate(booking.date);
    setEditStartTime(booking.startTime);
    setEditEndTime(booking.endTime);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/bookings/${editingBooking.id}`, {
        roomId: editingBooking.roomId,
        date: editDate,
        startTime: editStartTime,
        endTime: editEndTime,
      });
      setMessage('Booking updated successfully!');
      setEditingBooking(null);
      fetchBookings();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed due to time conflict.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Dynamic Outlook Sync Status Banner */}
      <div
        style={{
          background: isOutlookConnected ? '#f0fdf4' : '#f0f7ff',
          border: `1px solid ${isOutlookConnected ? '#16a34a' : '#0078d4'}`,
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 6px 0', color: isOutlookConnected ? '#15803d' : '#0078d4' }}>
            {isOutlookConnected ? '✅ Outlook Calendar Connected' : '📅 Outlook Calendar Auto-Sync'}
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#4b5563' }}>
            {isOutlookConnected
              ? 'New room bookings will automatically sync directly to your Outlook Calendar.'
              : 'Connect your Microsoft account to automatically add all room bookings to your calendar.'}
          </p>
        </div>

        {isOutlookConnected ? (
          <span
            style={{
              backgroundColor: '#dcfce7',
              color: '#15803d',
              padding: '6px 12px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '13px',
            }}
          >
            Connected
          </span>
        ) : (
          <button
            onClick={handleConnectOutlook}
            style={{
              backgroundColor: '#0078d4',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Connect Outlook
          </button>
        )}
      </div>

      <h2>My Upcoming Bookings</h2>
      {message && <p style={{ color: 'blue', fontWeight: 'bold' }}>{message}</p>}

      {editingBooking && (
        <div className="auth-form" style={{ marginBottom: '20px', background: '#eef6ff' }}>
          <h3>Edit Booking ({editingBooking.roomId})</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                min="08:00"
                max="15:30"
                step="1800"
                value={editStartTime}
                onChange={(e) => setEditStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                min="08:30"
                max="16:00"
                step="1800"
                value={editEndTime}
                onChange={(e) => setEditEndTime(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn" style={{ marginRight: '10px' }}>
              Save Changes
            </button>
            <button
              type="button"
              className="btn"
              style={{ backgroundColor: '#6c757d' }}
              onClick={() => setEditingBooking(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {bookings.length === 0 ? (
        <p>No upcoming bookings found.</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.id}
            style={{
              background: '#fff',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <p>
              <strong>Room:</strong>{' '}
              {b.roomId === 'default-room-a' ? 'Room A (Floor 6)' : 'Room B (Floor 8)'}
            </p>
            <p>
              <strong>Date:</strong> {b.date}
            </p>
            <p>
              <strong>Time Slot:</strong> {b.startTime} - {b.endTime}
            </p>
            <button
              onClick={() => startEditing(b)}
              style={{
                padding: '6px 12px',
                marginRight: '10px',
                backgroundColor: '#ffc107',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(b.id)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;