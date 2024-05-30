// authService.ts
import axios from 'axios';
import { message } from 'antd';

interface LoginFormFields {
  email: string;
  password: string;
  remember: boolean;
}

export const loginUser = async (values: LoginFormFields): Promise<string | null> => {
  try {
    const response = await axios.post(process.env.REACT_APP_LOGIN_API_URL!, {
      email: values.email,
      password: values.password,
    });

    if (response.status === 200) {
      const token = response.data.data.token;
      if (values.remember) {
        localStorage.setItem('token', token);  
        sessionStorage.setItem('token', token);
      }
      return token;
    } else {
      message.error('Inicio de sesión fallido: ' + response.data.message);
      return null;
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        message.error('El correo no se encontró');
      } else if (error.response?.status === 401) {
        message.error('Contraseña incorrecta');
      } else {
        message.error('Inicio de sesión fallido. Revisar la consola para más detalles.');
      }
      console.error('Error de inicio de sesión:', error);
    } else {
      console.error('Error de inicio de sesión:', error);
      message.error('Error inesperado durante el inicio de sesión. Revisar la consola para más detalles.');
    }
    return null;
  }
};
