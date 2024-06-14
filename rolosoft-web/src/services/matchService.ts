import axios from 'axios';
import { message } from 'antd';

export const registerMatch = async (token: string, tournamentId: string, phaseId: string, payload: any): Promise<boolean> => {
    const headers = { Authorization: token };
    if (!token) {
        message.error('Authorization token is missing');
        return false;
    }

    if (!tournamentId || !phaseId) {
        message.error('Tournament ID or phase ID is missing');
        return false;
    }

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/phases/${phaseId}/matches`,
            payload,
            { headers }
        );

        if (response.status === 201) {
            message.success('Partido registrado exitosamente!');
            return true;
        } else {
            message.error('Failed to register match');
            return false;
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.status === 401) {
                    message.error('Unauthorized access or token has expired');
                } else if (error.response.status === 404) {
                    message.error('Tournament or phase not found');
                } else {
                    message.error(`Error: ${error.response.data.message}`);
                }
            } else {
                message.error('Network error registering match');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return false;
    }
};

export const fetchMatch = async (token: string, tournamentId: string): Promise<any | null> => {
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
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/matches`,
            { headers }
        );

        if (response.status === 200 && response.data.success) {
            return response.data.data;
        } else {
            message.error('Failed to fetch matches');
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
                    message.error('Error fetching matches');
                }
            } else {
                message.error('Network error fetching matches');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return null;
    }
};

export const deleteMatch = async (token: string, matchId: string): Promise<boolean> => {
    const headers = { Authorization: token };
    if (!token) {
        message.error('Authorization token is missing');
        return false;
    }

    if (!matchId) {
        message.error('Match ID is missing');
        return false;
    }

    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/matches/${matchId}`,
            { headers }
        );

        if (response.status === 200) {
            message.success('Match deleted successfully!');
            return true;
        } else {
            message.error('Failed to delete match');
            return false;
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.status === 401) {
                    message.error('Unauthorized access or token has expired');
                } else if (error.response.status === 404) {
                    message.error('Match not found');
                } else {
                    message.error(`Error: ${error.response.data.message}`);
                }
            } else {
                message.error('Network error deleting match');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return false;
    }
};
