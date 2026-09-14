import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ROOM_OPTIONS = [
  { id: 'default-room-a', name: 'Meeting Room A (Floor 6)' },
  { id: 'default-room-b', name: 'Meeting Room B (Floor 8)' }
];

const BookRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [selectedRoom, setSelectedRoom] = useState(roomId || ROOM_OPTIONS[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('08:30');
  const [existingBookings, setExistingBookings] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Sync selected room from URL params
  useEffect(() => {
    if (roomId) setSelectedRoom(roomId);
  }, [roomId]);

  // Fetch current bookings to display live schedule conflicts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/bookings');
        setExistingBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch existing bookings', err);
      }
    };
    fetchBookings();
  }, [date, selectedRoom]);

  // Filter existing bookings for the currently selected room and date
  const roomBookings = existingBookings.filter(
    (b) => b.roomId === selectedRoom && b.date === date
  );

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Client-side minimum duration check (30 mins = 0.5 hours)
    const startMins = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const endMins = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

    if (endMins - startMins < 30) {
      setMessage({ type: 'error', text: 'Booking duration must be at least 30 minutes.' });
      return;
    }

    try {
      await API.post('/bookings', {
        roomId: selectedRoom,
        date,
        startTime,
        endTime,
        userEmail: user?.email,
        bookedBy: user?.name || user?.email || 'User'
      });

      setMessage({ type: 'success', text: 'Booking confirmed! A confirmation email has been sent.' });
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Booking failed. Time conflict detected.'
      });
    }
  };

  return (
    <div className="auth-form" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Book a Meeting Room</h2>

      {message.text && (
        <p style={{ color: message.type === 'error' ? 'red' : 'green', fontWeight: 'bold' }}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleBooking}>
        <div className="form-group">
          <label>Select Room</label>
          <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
            {ROOM_OPTIONS.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Start Time (8:00 AM – 3:30 PM)</label>
          <input
            type="time"
            min="08:00"
            max="15:30"
            step="1800"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>End Time (8:30 AM – 4:00 PM)</label>
          <input
            type="time"
            min="08:30"
            max="16:00"
            step="1800"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        {/* Live Availability Preview */}
        <div style={{ marginTop: '20px', background: '#f8f9fa', padding: '12px', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>Occupied Slots on {date}:</h4>
          {roomBookings.length === 0 ? (
            <p style={{ color: 'green', fontSize: '0.85rem', margin: 0 }}>
              All hours (8:00 AM – 4:00 PM) are fully available.
            </p>
          ) : (
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {roomBookings.map((b, idx) => (
                <li key={idx} style={{ color: '#dc3545', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Reserved: {b.startTime} - {b.endTime}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="btn" style={{ marginTop: '20px' }}>
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookRoom;