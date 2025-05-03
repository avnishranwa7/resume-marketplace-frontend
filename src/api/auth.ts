import axios from 'axios';
import baseUrl from './baseUrl';

export async function login(email: string, password: string) {
  const response = await axios.post(`${baseUrl}/auth/login`, {
    email,
    password,
  });
  return response.data;
}

export async function signup(formData: any) {
  const response = await axios.put(`${baseUrl}/auth/signup`, formData);
  return response.data;
} 