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

export const uploadStudentImage = async (token: string, studentId: string, imageFile: File): Promise<string | null> => {
    const headers = {
      Authorization: token,
      'Content-Type': 'multipart/form-data',
    };
  
    if (!token) {
      message.error('Falta el token de autorización');
      return null;
    }
  
    if (!studentId) {
      message.error('Falta el ID del estudiante');
      return null;
    }
  
    const formData = new FormData();
    formData.append('image', imageFile);
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/${studentId}/photo`,
        formData,
        { headers }
      );
  
      if (response.status === 201 && response.data.success) {
        return response.data.data.filename;
      } else {
        message.error('Error al subir la imagen');
        return null;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          message.error(`Error: ${error.response.data.message}`);
        } else {
          message.error('Error de red al subir la imagen');
        }
      } else {
        message.error('Ocurrió un error inesperado');
      }
      return null;
    }
  };
  
  export const registerGreenCard = async (token: string, studentId: string, reason: string): Promise<boolean> => {
    const headers = { Authorization: token };

    if (!token) {
        message.error('Falta el token de autorización');
        return false;
    }

    if (!studentId) {
        message.error('Falta el ID del estudiante');
        return false;
    }

    const payload = { reason };

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/users/${studentId}/green-cards`,
            payload,
            { headers }
        );

        if (response.status === 201 && response.data.success) {
            message.success('¡Tarjeta verde registrada con éxito!');
            return true;
        } else {
            message.error('Error al registrar la tarjeta verde');
            return false;
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.status === 401) {
                    message.error('Acceso no autorizado o el token ha expirado');
                } else {
                    message.error(`Error: ${error.response.data.message}`);
                }
            } else {
                message.error('Error de red al registrar la tarjeta verde');
            }
        } else {
            message.error('Ocurrió un error inesperado');
        }
        return false;
    }
};
