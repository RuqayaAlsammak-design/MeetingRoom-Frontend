import { createContext, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const login = async (credentials) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
    
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};