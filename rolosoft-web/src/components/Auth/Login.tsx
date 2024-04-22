import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';

interface LoginFormFields {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [simulateSuccess, setSimulateSuccess] = useState(false);  // Temporary simulation state

  const onFinish = async (values: LoginFormFields) => {
    if (simulateSuccess) {
      // Simulate successful login without calling the backend
      message.success('Simulated Login Successful');
      navigate('/dashboard');  // Correct navigation path after successful login
      return;
    }

    try {
      const response = await axios.post('/api/login', {
        username: values.username,
        password: values.password,
      });

      if (response.status === 200) {
        message.success('Login Successful');
        navigate('/dashboard');  // Correct navigation path after successful login
      } else {
        message.error('Login Failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Login Error:', error);
      message.error('Login failed. Check console for more details.');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Please correct the errors in the form.');
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
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
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>

      {/* Toggle switch for simulation */}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox checked={simulateSuccess} onChange={e => setSimulateSuccess(e.target.checked)}>
          Simulate Success
        </Checkbox>
      </Form.Item>
    </Form>
  );
};

export default Login;
