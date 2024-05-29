import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

interface SchoolFormValues {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  number: string;
}

interface RegisterSchoolsProps {
  onClose: () => void;
}

const RegisterSchools: React.FC<RegisterSchoolsProps> = ({ onClose }) => {
  const [form] = Form.useForm<SchoolFormValues>();

  const handleSubmit = async (values: SchoolFormValues) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const { name, address1, address2, city, state, postalCode, country, number } = values;
    const payload = {
      name,
      address: {
        address1,
        address2,
        city,
        state,
        postalCode,
        country,
      },
      number,
    };

    try {
      const response = await axios.post(process.env.REACT_APP_SCHOOLS_API_URL!, payload, { headers });
      if (response.data.success) {
        message.success('Escuela registrada exitosamente!');
        form.resetFields();
        onClose();
      } else {
        message.error('Failed to register school.');
      }
    } catch (error) {
      message.error('An error occurred while registering the school.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" rules={[{ required: true, message: 'Please enter the school name' }]}>
          <Input placeholder="Nombre de la escuela" />
        </Form.Item>
        <Form.Item name="address1" rules={[{ required: true, message: 'Please enter the address' }]}>
          <Input placeholder="Calle y Número" />
        </Form.Item>
        <Form.Item name="address2">
          <Input placeholder="Colonia" />
        </Form.Item>
        <Form.Item name="city" rules={[{ required: true, message: 'Please enter the city' }]}>
          <Input placeholder="Ciudad" />
        </Form.Item>
        <Form.Item name="state" rules={[{ required: true, message: 'Please enter the state' }]}>
          <Input placeholder="Estado" />
        </Form.Item>
        <Form.Item name="postalCode" rules={[{ required: true, message: 'Please enter the postal code' }]}>
          <Input placeholder="Código Postal" />
        </Form.Item>
        <Form.Item name="country" rules={[{ required: true, message: 'Please enter the country' }]}>
          <Input placeholder="País" />
        </Form.Item>
        <Form.Item name="number" rules={[{ required: true, message: 'Please enter the number' }]}>
          <Input placeholder="Número" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
          <Button type="primary" htmlType="submit">Registrar</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterSchools;
