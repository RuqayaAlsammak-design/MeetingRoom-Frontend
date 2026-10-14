import React, { useState } from 'react';
import API from '../services/api';

const BookingForm = ({ roomId, userEmail, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('WEEKLY');
  const [occurrences, setOccurrences] = useState(4);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'info', text: 'Validating booking availability...' });

    const startISO = new Date(`${startDate}T${startTime}`).toISOString();
    const endISO = new Date(`${startDate}T${endTime}`).toISOString();

    try {
      const endpoint = isRecurring ? '/bookings/recurring' : '/bookings';
      
      const payload = {
        room: roomId,
        title,
        organizer: userEmail,
        attendeesCount: Number(attendeesCount),
        startTime: startISO,
        endTime: endISO,
        ...(isRecurring && {
          frequency,
          occurrences: Number(occurrences)
        })
      };

      const res = await API.post(endpoint, payload);
      setStatus({ 
        type: 'success', 
        text: res.data.message || 'Booking confirmed! Calendar invite sent.' 
      });

      setTitle('');
      setAttendeesCount(1);
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.conflictingDates) {
        setStatus({
          type: 'error',
          text: `Conflicts found on: ${err.response.data.conflictingDates.join(', ')}`
        });
      } else {
        setStatus({
          type: 'error',
          text: err.response?.data?.error || err.response?.data?.message || 'Booking failed.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px', maxWidth: '450px' }}>
      <h3 style={{ marginTop: 0 }}>Book Meeting Room</h3>

      {status && (
        <p style={{ color: status.type === 'error' ? '#d9534f' : '#5cb85c', fontWeight: 'bold' }}>
          {status.text}
        </p>
      )}

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Meeting Title</label>
        <input
          type="text"
          required
          placeholder="e.g., Sprint Planning"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Attendees Count</label>
        <input
          type="number"
          min="1"
          required
          value={attendeesCount}
          onChange={(e) => setAttendeesCount(e.target.value)}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Date</label>
        <input
          type="date"
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Start Time</label>
          <input
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>End Time</label>
          <input
            type="time"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ cursor: 'pointer', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          {' '}Make this a recurring booking
        </label>
      </div>

      {isRecurring && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', background: '#eee', padding: '10px', borderRadius: '6px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="BIWEEKLY">Bi-Weekly</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Repeat Count</label>
            <input
              type="number"
              min="2"
              max="12"
              value={occurrences}
              onChange={(e) => setOccurrences(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: loading ? '#6c757d' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          marginTop: '10px'
        }}
      >
        {loading ? 'Processing...' : isRecurring ? 'Confirm Series Booking' : 'Confirm Single Booking'}
      </button>
    </form>
  );
};

export default BookingForm;