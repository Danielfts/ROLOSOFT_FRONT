import axios from 'axios';
import { message } from 'antd';

const token = localStorage.getItem('token');
const headers = { Authorization: token };

export const fetchPhase = async (tournamentId: string) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/phases`,
            { headers }
        );
        if (response.status === 200 && response.data.success) {
            return response.data.data;
        } else {
            message.error('Failed to fetch phases');
        }
    } catch (error) {
        message.error('Error fetching phases');
    }
};

export const deletePhase = async (phaseId: string) => {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/phases/${phaseId}`,
            { headers }
        );
        if (response.status === 200) {
            message.success('Fase eliminada exitosamente!');
            return true;
        } else {
            message.error('Failed to delete phase');
            return false;
        }
    } catch (error) {
        message.error('Failed to delete phase: ' + error);
        return false;
    }
};