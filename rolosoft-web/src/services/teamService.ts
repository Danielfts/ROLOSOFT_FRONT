import axios from 'axios';
import { message } from 'antd';

const token = localStorage.getItem('token');
const headers = { Authorization: token };

export const registerTeam = async (schoolId: string | null, sponsor: string, studentIds: string[]): Promise<void> => {
    const tournamentId = localStorage.getItem('selectedTournamentId');
    const payload = {
        school: { id: schoolId },
        sponsor,
        students: studentIds,
    };

    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools`, payload, { headers });
        if (response.status !== 201) {
            message.error('Failed to register team');
            throw new Error('Failed to register team');
        }
    } catch (error) {
        message.error('Error registering team');
        throw error;
    }
};

export const fetchTeam = async (tournamentId: string) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools?registered=true`,
            { headers }
        );
        if (response.status === 200 && response.data.success && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            message.error('Failed to fetch teams');
        }
    } catch (error) {
        message.error('Error fetching teams');
    }
};

export const addStudentToTeam = async (schoolId: string, playerId: string): Promise<void> => {
    const tournamentId = localStorage.getItem('selectedTournamentId');
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools/${schoolId}/students/${playerId}`,
            {},
            { headers }
        );

        if (response.status !== 201) {
            message.error('Failed to add player');
            throw new Error('Failed to add player');
        }
    } catch (error) {
        message.error('Error adding player');
        throw error;
    }
};
