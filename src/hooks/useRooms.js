import { useState, useEffect, useCallback } from 'react';
import { roomApi } from '../api/roomApi';

// Default corporate rooms fallback when backend is unreachable or returning empty
const DEFAULT_ROOMS = [
  { _id: '650000000000000000000001', name: 'Meeting room A', floor: 'Floor 5' },
  { _id: '650000000000000000000002', name: 'Meeting room B', floor: 'Floor 6' },
  { _id: '650000000000000000000003', name: 'Meeting room C', floor: 'Floor 8' },
];

export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await roomApi.getAllRooms();
      if (Array.isArray(data) && data.length > 0) {
        setRooms(data);
      } else {
        setRooms(DEFAULT_ROOMS);
      }
    } catch (err) {
      console.warn('Backend fetch failed, falling back to local room data:', err);
      // Populate fallback options and reset error to prevent UI blocking
      setRooms(DEFAULT_ROOMS);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const getRoomById = useCallback(async (roomId) => {
    try {
      setLoading(true);
      setError(null);
      
      const room = await roomApi.getRoomById(roomId);
      return room;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch room');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRoomAvailability = async (roomId, date) => {
    try {
      const availability = await roomApi.getRoomAvailability(roomId, date);
      return availability;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch availability');
      throw err;
    }
  };

  return { 
    rooms, 
    loading, 
    error, 
    fetchRooms, 
    getRoomById, 
    getRoomAvailability 
  };
};