import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, Layout, message } from 'antd';
import axios from 'axios';

const { Content } = Layout;

const layoutStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f0f2f5',
  padding: '20vh',
};

const formStyle: React.CSSProperties = {
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '300px',
};

interface LoginFormFields {
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormFields) => {
    try {
      const response = await axios.post(process.env.REACT_APP_LOGIN_API_URL!, {
        email: values.email,
        password: values.password,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.data.token); // Storing the token
        message.success('Inicio de sesión exitoso');
        navigate('/dashboard');
      } else {
        message.error('Inicio de sesión fallido: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Error de inicio de sesión:', error);
      message.error('Inicio de sesión fallido. Revisar la consola para más detalles.');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Por favor corriga los errores en los campos.');
  };

  return (
    <Layout style={layoutStyle}>
      <Content>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={formStyle}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Ingrese su email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Ingrese su contraseña' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Inicia Sesión
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default Login;
