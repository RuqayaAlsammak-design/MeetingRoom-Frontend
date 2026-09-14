import { Link } from 'react-router-dom';

const RoomList = () => {
  const rooms = [
    { 
      id: 'default-room-a', 
      name: 'Meeting Room A', 
      location: 'Floor 6', 
      capacity: '12-14', 
      amenities: 'Projector, Whiteboard' 
    },
    { 
      id: 'default-room-b', 
      name: 'Meeting Room B', 
      location: 'Floor 8', 
      capacity: '8-10', 
      amenities: 'TV Screen, projector, whiteboard' 
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Available Meeting Rooms</h2>
      {rooms.map((room) => (
        <div 
          key={room.id} 
          style={{ 
            background: '#fff', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '15px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}
        >
          <h3>{room.name}</h3>
          <p><strong>Location:</strong> {room.location}</p>
          <p><strong>Capacity:</strong> {room.capacity} people</p>
          <p style={{ color: '#666' }}>{room.amenities}</p>
          
          <Link to={`/book/${room.id}`} className="btn" style={{ display: 'inline-block', width: 'auto', textDecoration: 'none' }}>
            Book Room
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RoomList;