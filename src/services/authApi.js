import API from './api';

export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', {
    email: credentials.email,
    password: credentials.password
  });
  return response.data;
};