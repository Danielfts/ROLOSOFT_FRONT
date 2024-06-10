import axios from 'axios';
import { message } from 'antd';
import { School } from '../types/types';

export const registerSchool = async (token: string, payload: any): Promise<boolean> => {
  const headers = { Authorization: token };
  if (!token) {
    throw new Error('Authorization token is missing');
  }

  try {
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/schools`, payload, { headers });

    if (response.status === 201) {
      return true;
    } else {
      return false;
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Unauthorized access or token has expired');
        } else if (error.response.status === 404) {
          throw new Error('Resource not found');
        } else {
          throw new Error(`Error: ${error.response.data.message}`);
        }
      } else {
        throw new Error('Network error registering school');
      }
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};


export const fetchSchool = async (token: string): Promise<School[] | null> => {
    const headers = { Authorization: token };
    if (!token) {
        message.error('Authorization token is missing');
        return null;
    }

    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/schools`, { headers });

        if (response.status === 200 && response.data.success) {
            return response.data.data;
        } else {
            message.error('Failed to fetch schools');
            return null;
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.status === 401) {
                    message.error('Unauthorized access or token has expired');
                } else if (error.response.status === 404) {
                    message.error('Resource not found');
                } else {
                    message.error('Error fetching schools');
                }
            } else {
                message.error('Network error fetching schools');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return null;
    }
};

export const fetchRegisteredSchool = async (token: string, tournamentId: string): Promise<School[] | null> => {
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

        if (response.status === 200 && response.data.success) {
            return response.data.data;
        } else {
            message.error('Failed to fetch registered schools');
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
                    message.error('Error fetching registered schools');
                }
            } else {
                message.error('Network error fetching registered schools');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return null;
    }
};

export const fetchUnregisteredSchool = async (token: string, tournamentId: string): Promise<School[] | null> => {
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
            `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools?registered=false`,
            { headers }
        );

        if (response.status === 200 && response.data.success) {
            return response.data.data;
        } else {
            message.error('Failed to fetch unregistered schools');
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
                    message.error('Error fetching unregistered schools');
                }
            } else {
                message.error('Network error fetching unregistered schools');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return null;
    }
};

export const deleteSchool = async (token: string, schoolId: string): Promise<boolean> => {
    const headers = { Authorization: token };
    if (!token) {
        message.error('Authorization token is missing');
        return false;
    }

    if (!schoolId) {
        message.error('School ID is missing');
        return false;
    }

    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/schools/${schoolId}`,
            { headers }
        );

        if (response.status === 200) {
            message.success('School deleted successfully!');
            return true;
        } else {
            message.error('Failed to delete school');
            return false;
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.status === 401) {
                    message.error('Unauthorized access or token has expired');
                } else if (error.response.status === 404) {
                    message.error('School not found');
                } else {
                    message.error(`Error: ${error.response.data.message}`);
                }
            } else {
                message.error('Network error deleting school');
            }
        } else {
            message.error('An unexpected error occurred');
        }
        return false;
    }
};
