import axios from 'axios';
import { message } from 'antd';
import { User } from '../types/types';

export const fetchUsers = async (token: string): Promise<User[] | null> => {
  const headers = { Authorization: token };
  if (!token) {
    message.error('Authorization token is missing');
    return null;
  }

  try {
    const response = await axios.get(`${process.env.REACT_APP_USERS_API_URL}`, { headers });

    if (response.status === 200 && response.data.success) {
      return response.data.data;
    } else {
      message.error('Failed to fetch users');
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          message.error('Unauthorized access or token has expired');
        } else if (error.response.status === 404) {
          message.error('Resource not found');
        } else {
          message.error(`Error: ${error.response.data.message}`);
        }
      } else {
        message.error('Network error fetching users');
      }
    } else {
      message.error('An unexpected error occurred');
    }
    return null;
  }
};

export const deleteUser = async (token: string, userId: string): Promise<boolean> => {
  const headers = { Authorization: token };
  if (!token) {
    message.error('Authorization token is missing');
    return false;
  }

  try {
    const response = await axios.delete(`${process.env.REACT_APP_USERS_API_URL}/${userId}`, { headers });

    if (response.status === 200) {
      message.success('Usuario eliminado exitosamente!');
      return true;
    } else {
      message.error('Failed to delete user');
      return false;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          message.error('Unauthorized access or token has expired');
        } else if (error.response.status === 404) {
          message.error('Resource not found');
        } else {
          message.error(`Error: ${error.response.data.message}`);
        }
      } else {
        message.error('Network error deleting user');
      }
    } else {
      message.error('An unexpected error occurred');
    }
    return false;
  }
};
