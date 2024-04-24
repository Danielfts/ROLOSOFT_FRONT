import React, { useState } from 'react';
import './styles/Login.css';

import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, Layout, message } from 'antd';
import axios from 'axios';

const { Content } = Layout;

interface LoginFormFields {
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormFields) => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL!, {
        email: values.email,
        password: values.password,
      });

      if (response.status === 200) {
        message.success('Login Successful');
        navigate('/dashboard');
      } else {
        // This block may not be needed if you're catching errors properly below
        message.error('Login Failed: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      if (error.response) {
        const { status } = error.response;
        switch (status) {
          case 401:
            message.error('Unauthorized: Incorrect password.');
            break;
          case 404:
            message.error('Not Found: Email does not exist.');
            break;
          default:
            message.error('Login failed. ' + (error.response.data?.message || 'Check console for more details.'));
            break;
        }
      } else {
        message.error('Login failed. Network error or no response from server.');
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Please correct the errors in the form.');
  };

  return (
    <Layout className="layoutStyle">
      <Content>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="formStyle"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
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
        </Form>
      </Content>
    </Layout>
  );
};

export default Login;
