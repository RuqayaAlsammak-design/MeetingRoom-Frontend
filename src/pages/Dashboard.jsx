import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuthContext } from '../context/AuthContext';
import { useRooms } from '../hooks/useRooms';
import { useBookings } from '../hooks/useBooking';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user } = useAuthContext();
  const { rooms, loading: roomsLoading } = useRooms();
  const { userBookings, loading: bookingsLoading, fetchUserBookings } = useBookings();
  const [currentDate] = useState(new Date());

  const timeSlots = [
    { hour: 8, label: '08:00 AM' },
    { hour: 9, label: '09:00 AM' },
    { hour: 10, label: '10:00 AM' },
    { hour: 11, label: '11:00 AM' },
    { hour: 12, label: '12:00 PM' },
    { hour: 13, label: '01:00 PM' },
    { hour: 14, label: '02:00 PM' },
    { hour: 15, label: '03:00 PM' },
    { hour: 16, label: '04:00 PM' },
    { hour: 17, label: '05:00 PM' },
  ];

  useEffect(() => {
    if (user?._id) {
      fetchUserBookings(user._id);
    }
  }, [user, fetchUserBookings]);

  if (roomsLoading || bookingsLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#1d3567' }}></div>
        </div>
      </Layout>
    );
  }

  const upcoming = (userBookings || [])
    .filter(booking => new Date(booking.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  return (
    <Layout>
      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#1d3567' }}>
              Welcome, {user?.name || user?.username || 'User'}
            </h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base mt-1">
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>

          <Link
            to="/book"
            className="mt-4 sm:mt-0 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-all text-sm inline-flex items-center gap-2"
            style={{ backgroundColor: '#1d3567', color: '#ffffff' }}
          >
            <span style={{ color: '#ffffff' }}>+</span> Book a Room
          </Link>
        </div>

        {/* Upcoming Bookings Section */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-bold border-b border-slate-100 pb-4 mb-6" style={{ color: '#1d3567' }}>
            Your Upcoming Bookings
          </h2>

          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.slice(0, 3).map(booking => (
                <motion.div
                  key={booking._id}
                  whileHover={{ y: -3 }}
                  className="bg-slate-50 rounded-lg p-5 border-l-4 border-slate-200 shadow-sm flex flex-col justify-between"
                  style={{ borderLeftColor: '#1d3567' }}
                >
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">{booking.title}</h3>
                    <p className="text-slate-500 text-sm mt-0.5">{booking.roomName || 'Meeting Room'}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs sm:text-sm text-slate-700">
                    <span className="font-medium bg-blue-50 text-blue-900 px-2.5 py-1 rounded-md">
                      {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                    </span>
                    <span className="text-slate-500">Attendees: {booking.attendeeCount || 1}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm py-4">You don't have any upcoming bookings.</p>
          )}

          {userBookings?.length > 0 && (
            <div className="mt-6">
              <Link to="/my-bookings" className="font-semibold text-sm hover:underline inline-flex items-center gap-1" style={{ color: '#1d3567' }}>
                View all bookings &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Room Availability Timeline */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold border-b border-slate-100 pb-4 mb-6" style={{ color: '#1d3567' }}>
            Room Availability Today
          </h2>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <div className="min-w-max">
              {/* Timeline Header */}
              <div className="grid grid-cols-[200px_repeat(10,100px)] bg-slate-100/80 py-3 border-b border-slate-200">
                <div className="px-4 font-semibold text-xs tracking-wider uppercase text-slate-600">Room</div>
                {timeSlots.map(slot => (
                  <div key={slot.hour} className="text-center text-xs font-semibold text-slate-600 uppercase">
                    {slot.label}
                  </div>
                ))}
              </div>

              {/* Timeline Rows */}
              {rooms.map((room, idx) => (
                <div
                  key={room._id}
                  className={`grid grid-cols-[200px_repeat(10,100px)] items-center py-3 ${
                    idx !== rooms.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="px-4 font-medium text-slate-800 text-sm truncate">
                    {room.name} {room.floor ? `(${room.floor})` : ''}
                  </div>
                  {timeSlots.map(slot => (
                    <div key={slot.hour} className="flex justify-center items-center px-1">
                      <div className="w-full h-7 bg-emerald-100/80 border border-emerald-300 rounded text-[10px] text-emerald-800 font-medium flex items-center justify-center">
                        Free
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Link to="/rooms" className="font-semibold text-sm hover:underline inline-flex items-center gap-1" style={{ color: '#1d3567' }}>
              View all rooms &rarr;
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;