import axios from 'axios';
import { message } from 'antd';
import { Student } from '../types/types';

export const fetchRegisteredStudent = async (token: string, tournamentId: string): Promise<Student[] | null> => {
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
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/players?registered=true`,
            { headers }
        );

        if (response.status === 200 && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            message.error('Failed to fetch registered students');
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
                    message.error('Error fetching registered students');
                }
            } else {
                message.error('Network error fetching registered students');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return null;
    }
};

export const fetchUnregisteredStudent = async (token: string, tournamentId: string): Promise<Student[] | null> => {
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
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/players?registered=false`,
            { headers }
        );

        if (response.status === 200 && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            message.error('Failed to fetch unregistered students');
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
                    message.error('Error fetching unregistered students');
                }
            } else {
                message.error('Network error fetching unregistered students');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return null;
    }
};

export const fetchStudentsByTeam = async (token: string, tournamentId: string, schoolId: string): Promise<Student[] | null> => {
    const headers = { Authorization: token };
    if (!token) {
        message.error('Authorization token is missing');
        return null;
    }

    if (!tournamentId || !schoolId) {
        message.error('Tournament ID or school ID is missing');
        return null;
    }

    try {
        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools/${schoolId}/players`,
            { headers }
        );

        if (response.status === 200 && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            message.error('Failed to fetch students by team');
            return null;
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.status === 401) {
                    message.error('Unauthorized access or token has expired');
                } else if (error.response.status === 404) {
                    message.error('Tournament or school not found');
                } else {
                    message.error('Error fetching students by team');
                }
            } else {
                message.error('Network error fetching students by team');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return null;
    }
};

export const deleteStudent = async (token: string, studentCURP: string): Promise<boolean> => {
    const headers = { Authorization: token };
    if (!token) {
        message.error('Authorization token is missing');
        return false;
    }

    if (!studentCURP) {
        message.error('Student CURP is missing');
        return false;
    }

    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/players/${studentCURP}`,
            { headers }
        );

        if (response.status === 200) {
            message.success('Student deleted successfully!');
            return true;
        } else {
            message.error('Failed to delete student');
            return false;
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.status === 401) {
                    message.error('Unauthorized access or token has expired');
                } else if (error.response.status === 404) {
                    message.error('Student not found');
                } else {
                    message.error(`Error: ${error.response.data.message}`);
                }
            } else {
                message.error('Network error deleting student');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return false;
    }
};
