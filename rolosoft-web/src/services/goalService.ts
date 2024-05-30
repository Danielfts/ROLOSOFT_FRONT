import axios from 'axios';
import { message } from 'antd';

export const registerGoal = async (token: string, tournamentId: string, matchId: string, payload: any): Promise<boolean> => {
    const headers = { Authorization: token };
    if (!token) {
        message.error('Authorization token is missing');
        return false;
    }

    if (!tournamentId || !matchId) {
        message.error('Tournament ID or match ID is missing');
        return false;
    }

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/matches/${matchId}`,
            payload,
            { headers }
        );

        if (response.status === 201 && response.data.success) {
            message.success('Goal registered successfully');
            return true;
        } else {
            message.error('Failed to register goal');
            return false;
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.status === 401) {
                    message.error('Unauthorized access or token has expired');
                } else if (error.response.status === 404) {
                    message.error('Tournament or match not found');
                } else {
                    message.error(`Error: ${error.response.data.message}`);
                }
            } else {
                message.error('Network error registering goal');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return false;
    }
};
