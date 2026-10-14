import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState({ stats: {}, bookings: [] });
  const [loading, setLoading] = useState(true);
  const [filterRoom, setFilterRoom] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/dashboard');
      if (res.data.success) {
        setData({
          stats: res.data.stats || {},
          bookings: res.data.bookings || []
        });
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking and remove it from Outlook?')) {
      return;
    }

    try {
      setActionLoading(bookingId);
      const res = await API.put(`/admin/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        alert(res.data.message || 'Booking cancelled successfully');
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = data.bookings.filter((b) => {
    const roomMatch =
      filterRoom === 'ALL' ||
      (filterRoom === '6TH' && b.room?.email === '6th_Meeting_Room@silah.bh') ||
      (filterRoom === '8TH' && b.room?.email === '8th_Meeting_Room@silah.bh');

    const statusMatch = filterStatus === 'ALL' || b.status === filterStatus;

    return roomMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-600">Loading Silah Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Silah Admin Booking Dashboard</h1>
            <p className="text-sm text-gray-500">
              Manage 6th & 8th Floor Meeting Rooms and Microsoft 365 Outlook Sync
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            Refresh Data
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase">Active Rooms</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{data.stats.totalRooms || 0}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{data.stats.totalBookings || 0}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-semibold text-green-600 uppercase">Confirmed (Synced)</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{data.stats.confirmedBookings || 0}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-semibold text-red-500 uppercase">Cancelled</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{data.stats.cancelledBookings || 0}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 w-full md:w-auto">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Filter by Room</label>
              <select
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
                className="p-2 border rounded-md text-sm bg-white border-gray-300 focus:ring focus:ring-blue-200"
              >
                <option value="ALL">All Rooms</option>
                <option value="6TH">6th Floor Room (6th_Meeting_Room@silah.bh)</option>
                <option value="8TH">8th Floor Room (8th_Meeting_Room@silah.bh)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border rounded-md text-sm bg-white border-gray-300 focus:ring focus:ring-blue-200"
              >
                <option value="ALL">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold">{filteredBookings.length}</span> entries
          </p>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase border-b">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Room</th>
                  <th className="px-6 py-3">Organizer</th>
                  <th className="px-6 py-3">Date & Time</th>
                  <th className="px-6 py-3">Outlook Sync</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                      No bookings found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-800">{b.title}</td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-700">{b.room?.name || 'Unknown'}</span>
                        <br />
                        <span className="text-xs text-gray-400">{b.room?.email}</span>
                      </td>
                      <td className="px-6 py-4">{b.organizer}</td>
                      <td className="px-6 py-4">
                        {new Date(b.startTime).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-gray-500">
                          {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                          {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {b.graphEventId ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Synced (Graph)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Local Only
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {b.status === 'confirmed' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            disabled={actionLoading === b._id}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 disabled:opacity-50 transition"
                          >
                            {actionLoading === b._id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;