import axios from 'axios';
import { message } from 'antd';
import { User, Student } from '../types/types';

export const registerUser = async (token: string, payload: User | Student): Promise<boolean> => {
    const headers = { Authorization: token };
    if (!token) {
        message.error('Authorization token is missing');
        return false;
    }

    try {
        const response = await axios.post(`${process.env.REACT_APP_USERS_API_URL}`, payload, { headers });

        if (response.status === 201) {
            message.success('El usuario fue registrado exitosamente!');
            return true;
        } else {
            message.error('Failed to register user');
            return false;
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const errorMessage = error.response.data.message;
                if (error.response.status === 403) {
                    message.error('No tienes permiso para realizar esta acción.');
                } else if (error.response.status === 400) {
                    if (errorMessage === 'CURP already exists') {
                        message.error('Una cuenta ya se registró con ese CURP');
                    } else if (errorMessage === 'email already exists') {
                        message.error('Una cuenta ya se registró con ese correo electrónico');
                    } else {
                        message.error(`Error: ${errorMessage || 'Error de servidor'}`);
                    }
                } else {
                    message.error(`Error: ${errorMessage || 'Error de servidor'}`);
                }
            } else {
                message.error('Error de red o servidor, por favor verifica tu conexión.');
            }
        } else {
            message.error('Un error inesperado ha ocurrido.');
        }
        return false;
    }
};


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
