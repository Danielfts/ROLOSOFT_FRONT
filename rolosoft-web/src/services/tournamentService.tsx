import axios from 'axios';
import { message } from 'antd';
import { Tournament } from '../types/types';

export const registerTournament = async (token: string, payload: Omit<Tournament, 'id'>): Promise<boolean> => {
    const headers = { Authorization: token };
    if (!token) {
        message.error('Authorization token is missing');
        return false;
    }

    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/tournaments/`, payload, { headers });

        if (response.status === 201) {
            message.success('Torneo Registrado Exitosamente!');
            return true;
        } else {
            message.error('Failed to register tournament.');
            return false;
        }
    } catch (error: unknown) {
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
                message.error('Network error registering tournament');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return false;
    }
};

export const fetchTournaments = async (token: string): Promise<Tournament[] | null> => {
  const headers = { Authorization: token };
  if (!token) {
    message.error('Authorization token is missing');
    return null;
  }

  try {
    const response = await axios.get(`${process.env.REACT_APP_TOURNAMENTS_API_URL}`, { headers });

    if (response.status === 200 && response.data.success) {
      return response.data.data;
    } else {
      message.error('Failed to fetch tournaments');
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
        message.error('Network error fetching tournaments');
      }
    } else {
      message.error('An unexpected error occurred');
    }
    return null;
  }
};

export const deleteTournament = async (token: string, tournamentId: number): Promise<boolean> => {
  const headers = { Authorization: token };
  if (!token) {
    message.error('Authorization token is missing');
    return false;
  }

  try {
    const response = await axios.delete(`${process.env.REACT_APP_TOURNAMENTS_API_URL}/${tournamentId}`, { headers });

    if (response.status === 200) {
      message.success('Torneo eliminado exitosamente!');
      return true;
    } else {
      message.error('Failed to delete tournament');
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
        message.error('Network error deleting tournament');
      }
    } else {
      message.error('An unexpected error occurred');
    }
    return false;
  }
};
