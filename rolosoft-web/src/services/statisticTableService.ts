import axios from 'axios';
import { message } from 'antd';

export const fetchGeneralTable = async (token: string, tournamentId: string): Promise<any | null> => {
    if (!token) {
        message.error('Authorization token is missing');
        return null;
    }

    if (!tournamentId) {
        message.error('Tournament ID is missing');
        return null;
    }

    const headers = { Authorization: token };

    try {
        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/general-table`,
            { headers }
        );

        if (response.status === 200 && response.data.success) {
            return response.data.data;
        } else {
            message.error('Failed to fetch general table');
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
                    message.error('Error fetching general table');
                }
            } else {
                message.error('Network error fetching general table');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return null;
    }
};

export const fetchGoalTable = async (token: string, tournamentId: string): Promise<any | null> => {
    if (!token) {
        message.error('Authorization token is missing');
        return null;
    }

    if (!tournamentId) {
        message.error('Tournament ID is missing');
        return null;
    }

    const headers = { Authorization: token };

    try {
        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/scoring-table`,
            { headers }
        );

        if (response.status === 200 && response.data.success) {
            return response.data.data;
        } else {
            message.error('Failed to fetch goal table');
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
                    message.error('Error fetching goal table');
                }
            } else {
                message.error('Network error fetching goal table');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return null;
    }
};
