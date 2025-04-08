import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post('/users', data);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// outros métodos (getOne, update, delete) podem seguir o mesmo padrão
