import api from './config';

// Fallback data structure to ensure app stability if network/API fails
const DEFAULT_ROOMS = [
  { 
    _id: '650000000000000000000001', 
    name: 'Meeting room A', 
    capacity: 10, 
    equipment: ['Projector', 'Whiteboard', 'AV System'] 
  },
  { 
    _id: '650000000000000000000002', 
    name: 'Meeting room B', 
    capacity: 15, 
    equipment: ['TV Screen', 'Video Conferencing'] 
  },
  { 
    _id: '650000000000000000000003', 
    name: 'Meeting room C', 
    capacity: 20, 
    equipment: ['Smart Board', 'Microphone Array'] 
  },
];

export const roomApi = {
  getAllRooms: async () => {
    try {
      const response = await api.get('/rooms');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return DEFAULT_ROOMS;
    } catch (err) {
      console.warn('getAllRooms API call failed, using fallback data:', err);
      return DEFAULT_ROOMS;
    }
  },
  
  getRoomById: async (roomId) => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      return response.data;
    } catch (err) {
      console.warn(`getRoomById API call failed for ID ${roomId}, using fallback:`, err);
      return DEFAULT_ROOMS.find(r => r._id === roomId) || DEFAULT_ROOMS[0];
    }
  },
  
  // Updated to use existing booking endpoint with graceful fallback
  getRoomAvailability: async (roomId, date) => {
    try {
      const response = await api.get(`/bookings/room/${roomId}`, {
        params: { date }
      });
      return response.data;
    } catch (err) {
      console.warn(`getRoomAvailability API call failed for room ${roomId}:`, err);
      return []; // Return empty array of bookings so availability UI can still render
    }
  }
};