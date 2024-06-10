import axios from 'axios';
import { message } from 'antd';

export const registerGreenCard = async (studentId: string, payload: any): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/users/${studentId}/green-cards`,
      payload
    );

    if (response.status === 201) {
      return true;
    } else {
      message.error('Failed to register green card');
      return false;
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message.error(`Error: ${error.response.data.message}`);
      } else {
        message.error('Network error registering green card');
      }
    } else {
      message.error('An unexpected error occurred');
    }
    return false;
  }
};
