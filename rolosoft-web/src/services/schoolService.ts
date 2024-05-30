import axios from 'axios';
import { message } from 'antd';
import { School, Student } from '../types/types';

const token = localStorage.getItem('token');
const headers = { Authorization: token };

export const fetchRegisteredSchools = async (): Promise<School[]> => {
  const tournamentId = localStorage.getItem('selectedTournamentId');
  if (!tournamentId) {
    message.error('No tournament ID found');
    throw new Error('No tournament ID found');
  }

  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools?registered=true`, { headers });
    if (response.status === 200 && response.data.success) {
      return response.data.data;
    } else {
      message.error('Failed to fetch schools');
      throw new Error('Failed to fetch schools');
    }
  } catch (error) {
    message.error('Error fetching schools');
    throw error;
  }
};

export const fetchUnregisteredSchools = async (): Promise<School[]> => {
    const tournamentId = localStorage.getItem('selectedTournamentId');
    if (!tournamentId) {
      message.error('No tournament ID found');
      throw new Error('No tournament ID found');
    }
  
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools?registered=false`, { headers });
      if (response.status === 200 && response.data.success) {
        return response.data.data;
      } else {
        message.error('Failed to fetch schools');
        throw new Error('Failed to fetch schools');
      }
    } catch (error) {
      message.error('Error fetching schools');
      throw error;
    }
  };

export const deleteSchool = async (schoolId: string): Promise<void> => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/schools/${schoolId}`, { headers });
    if (response.status !== 200) {
      message.error('Failed to delete school');
      throw new Error('Failed to delete school');
    }
  } catch (error) {
    message.error('Failed to delete school: ' + error);
    throw error;
  }
};