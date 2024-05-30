import axios from 'axios';
import { message } from 'antd';
import { School, Student } from '../types/types';

const token = localStorage.getItem('token');
const headers = { Authorization: token };

export const fetchRegisteredStudent = async (): Promise<Student[]> => {
  const tournamentId = localStorage.getItem('selectedTournamentId');
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/players?registered=true`, { headers });
    if (response.status === 200 && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      message.error('Failed to fetch students');
      throw new Error('Failed to fetch students');
    }
  } catch (error) {
    message.error('Error fetching students');
    throw error;
  }
};

export const fetchUnregisteredStudent = async (): Promise<Student[]> => {
    const tournamentId = localStorage.getItem('selectedTournamentId');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/players?registered=false`, { headers });
      if (response.status === 200 && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        message.error('Failed to fetch students');
        throw new Error('Failed to fetch students');
      }
    } catch (error) {
      message.error('Error fetching students');
      throw error;
    }
  };
  