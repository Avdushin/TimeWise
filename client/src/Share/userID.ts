//@ts-nocheck
import Cookies from 'universal-cookie';
import jwt from 'jsonwebtoken';
import { SECRET } from '@/Share/Variables';

export const setUserIDFromCookie = () => {
  const cookies = new Cookies();
  const token = cookies.get('token');

  if (token) {
    try {
      const decodedToken = jwt.verify(token, SECRET);
      const userId = (decodedToken as { id: number }).id;

      localStorage.setItem('userID', userId.toString());
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  }
};
