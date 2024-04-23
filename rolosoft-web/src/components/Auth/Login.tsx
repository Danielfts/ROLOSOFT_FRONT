import React, { useState } from 'react';
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
  maxWidth: '300px',  // Keeps the form reasonably narrow
};


interface LoginFormFields {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [simulateSuccess, setSimulateSuccess] = useState<boolean>(false);

  const onFinish = async (values: LoginFormFields) => {
    if (simulateSuccess) {
      message.success('Simulated Login Successful');
      navigate('/dashboard');
      return;
    }

    try {
      const response = await axios.post('/api/login', {
        username: values.username,
        password: values.password,
      });

      if (response.status === 200) {
        message.success('Login Successful');
        navigate('/dashboard');
      } else {
        message.error('Login Failed: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      message.error('Login failed. Check console for more details.');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Please correct the errors in the form.');
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
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
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
              Submit
            </Button>
          </Form.Item>
          <Form.Item>
            <Checkbox checked={simulateSuccess} onChange={e => setSimulateSuccess(e.target.checked)}>
              Simulate Success
            </Checkbox>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default Login;
