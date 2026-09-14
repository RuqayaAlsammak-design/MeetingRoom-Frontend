import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <h1>Welcome to Meeting Room Booking Platform</h1>
      <p style={{ margin: '15px 0' }}>Book conference rooms easily and manage reservations seamlessly.</p>
      <Link to="/rooms" className="btn">View Available Rooms</Link>
    </div>
  );
};

export default Home;