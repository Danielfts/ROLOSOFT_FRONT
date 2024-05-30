import axios from 'axios';
import { message } from 'antd';

export const registerTeam = async (token: string, tournamentId: string, schoolId: string | null, sponsor: string, studentIds: string[]): Promise<boolean> => {
    const headers = { Authorization: token };
    if (!token) {
        message.error('Authorization token is missing');
        return false;
    }

    if (!tournamentId) {
        message.error('Tournament ID is missing');
        return false;
    }

    const payload = {
        school: { id: schoolId },
        sponsor,
        students: studentIds,
    };

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools`,
            payload,
            { headers }
        );

        if (response.status === 201) {
            message.success('Team registered successfully!');
            return true;
        } else {
            message.error('Failed to register team');
            return false;
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.status === 401) {
                    message.error('Unauthorized access or token has expired');
                } else if (error.response.status === 404) {
                    message.error('Tournament not found');
                } else {
                    message.error(`Error: ${error.response.data.message}`);
                }
            } else {
                message.error('Network error registering team');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return false;
    }
};

export const fetchTeam = async (token: string, tournamentId: string): Promise<any[] | null> => {
    const headers = { Authorization: token };
    if (!token) {
        message.error('Authorization token is missing');
        return null;
    }

    if (!tournamentId) {
        message.error('Tournament ID is missing');
        return null;
    }

    try {
        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools?registered=true`,
            { headers }
        );

        if (response.status === 200 && response.data.success && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            message.error('Failed to fetch teams');
            return null;
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.status === 401) {
                    message.error('Unauthorized access or token has expired');
                } else if (error.response.status === 404) {
                    message.error('Tournament not found');
                } else {
                    message.error('Error fetching teams');
                }
            } else {
                message.error('Network error fetching teams');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return null;
    }
};

export const addStudentToTeam = async (token: string, tournamentId: string, schoolId: string, playerId: string): Promise<boolean> => {
    const headers = { Authorization: token };
    if (!token) {
        message.error('Authorization token is missing');
        return false;
    }

    if (!tournamentId || !schoolId || !playerId) {
        message.error('Tournament ID, school ID, or player ID is missing');
        return false;
    }

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools/${schoolId}/students/${playerId}`,
            {},
            { headers }
        );

        if (response.status === 201) {
            message.success('Player added to team successfully!');
            return true;
        } else {
            message.error('Failed to add player to team');
            return false;
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.status === 401) {
                    message.error('Unauthorized access or token has expired');
                } else if (error.response.status === 404) {
                    message.error('Tournament or school not found');
                } else {
                    message.error(`Error: ${error.response.data.message}`);
                }
            } else {
                message.error('Network error adding player to team');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return false;
    }
};
