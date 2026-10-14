import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRooms } from '../hooks/useRooms';
import Layout from '../components/Layout';
import API from '../services/api';

const DEFAULT_ROOMS = [
  { _id: '650000000000000000000001', name: 'Meeting room A', floor: 'Floor 5' },
  { _id: '650000000000000000000002', name: 'Meeting room B', floor: 'Floor 6' },
  { _id: '650000000000000000000003', name: 'Meeting room C', floor: 'Floor 8' },
];

const BookRoom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedRoomId = searchParams.get('roomId') || '';

  const { rooms, loading } = useRooms();
  const roomList = Array.isArray(rooms) && rooms.length > 0 ? rooms : DEFAULT_ROOMS;

  const [formData, setFormData] = useState({
    roomId: preselectedRoomId || roomList[0]?._id || '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    attendees: 1,
    startTime: '09:00',
    endTime: '10:00',
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (preselectedRoomId) {
      setFormData(prev => ({ ...prev, roomId: preselectedRoomId }));
    } else if (roomList.length > 0 && !formData.roomId) {
      setFormData(prev => ({ ...prev, roomId: roomList[0]._id }));
    }
  }, [preselectedRoomId, roomList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: 'info', text: 'Validating room availability...' });

    const startISO = new Date(`${formData.date}T${formData.startTime}`).toISOString();
    const endISO = new Date(`${formData.date}T${formData.endTime}`).toISOString();

    const payload = {
      room: formData.roomId,
      title: formData.title,
      attendeesCount: Number(formData.attendees),
      startTime: startISO,
      endTime: endISO,
    };

    try {
      const res = await API.post('/bookings', payload);
      setStatus({
        type: 'success',
        text: res.data?.message || 'Booking confirmed! Calendar invite sent.',
      });
      setTimeout(() => navigate('/rooms'), 1800);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to process booking. Please try again.';
      setStatus({ type: 'error', text: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <button
          onClick={() => navigate('/rooms')}
          className="text-slate-500 hover:text-slate-700 text-sm mb-4 inline-block"
        >
          ← Back to Rooms
        </button>

        <h1 className="text-2xl font-bold text-slate-800 mb-6">Book a Meeting Room</h1>

        {status && (
          <div
            className={`p-4 rounded-lg mb-4 font-medium text-sm ${
              status.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : status.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              ROOM
            </label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            >
              <option value="" disabled>Select a room...</option>
              {roomList.map(room => (
                <option key={room._id || room.id} value={room._id || room.id}>
                  {room.name} {room.floor ? `(${room.floor})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              MEETING TITLE
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Q4 Planning & Architecture"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                DATE
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                ATTENDEES
              </label>
              <input
                type="number"
                name="attendees"
                min="1"
                value={formData.attendees}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                START TIME
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                END TIME
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-colors mt-4 disabled:opacity-50"
          >
            {submitting ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default BookRoom;