import axios from 'axios';
import { message } from 'antd';

const token = localStorage.getItem('token');
const headers = { Authorization: token };

export const registerMatch = async (tournamentId: string, phaseId: string, payload: any) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/phases/${phaseId}/matches`,
            payload,
            { headers }
        );

        if (response.status === 201) {
            message.success('Match registered successfully!');
            return true;
        } else {
            message.error('Failed to register match');
            return false;
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            message.error(`Error: ${error.response.data.message}`);
        } else {
            message.error('Error registering match');
        }
        return false;
    }
};

export const fetchMatches = async (tournamentId: string) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/matches`,
            { headers }
        );
        if (response.status === 200 && response.data.success) {
            return response.data.data;
        } else {
            message.error('Failed to fetch matches');
        }
    } catch (error) {
        message.error('Error fetching matches');
    }
};

export const deleteMatch = async (matchId: string) => {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/matches/${matchId}`,
            { headers }
        );
        if (response.status === 200) {
            message.success('Partido eliminado exitosamente!');
            return true;
        } else {
            message.error('Failed to delete match');
            return false;
        }
    } catch (error) {
        message.error('Failed to delete match: ' + error);
        return false;
    }
};