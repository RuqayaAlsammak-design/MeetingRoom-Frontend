import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setLocalError('Invalid email or password.');
      } else if (err.response && err.response.status === 400) {
        setLocalError(err.response.data?.message || 'Bad request. Please check input fields.');
      } else {
        setLocalError('Server error. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Meeting Room Booking</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {localError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {localError}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/30"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/30"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;