import axios from 'axios';
import { message } from 'antd';

export const fetchPhase = async (token: string, tournamentId: string): Promise<any | null> => {
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
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/phases`,
            { headers }
        );

        if (response.status === 200 && response.data.success) {
            return response.data.data;
        } else {
            message.error('Failed to fetch phases');
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
                    message.error('Error fetching phases');
                }
            } else {
                message.error('Network error fetching phases');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return null;
    }
};