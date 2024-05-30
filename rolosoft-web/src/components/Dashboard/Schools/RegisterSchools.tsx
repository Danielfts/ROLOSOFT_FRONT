import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { registerSchool } from '../../../services/schoolService';
import { School } from '../../../types/types';

interface RegisterSchoolsProps {
  onClose: () => void;
}

const RegisterSchools: React.FC<RegisterSchoolsProps> = ({ onClose }) => {
  const [form] = Form.useForm<School>();

  const handleSubmit = async (values: School) => {
    const token = localStorage.getItem('token');

    if (!token) {
      message.error('No se encontró ningun token, por favor inicie sesión');
      return;
    }

    const payload = {
      name: values.name,
      address: {
        address1: values.address.address1,
        address2: values.address.address2,
        city: values.address.city,
        state: values.address.state,
        postalCode: values.address.postalCode,
        country: values.address.country,
      },
      number: values.number,
    };

    try {
      const success = await registerSchool(token, payload);
      if (success) {
        message.success('Escuela registrada exitosamente!');
        form.resetFields();
        onClose();
      } else {
        message.error('Failed to register school.');
      }
    } catch (error: any) {
      message.error(error.message || 'An error occurred while registering the school.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" rules={[{ required: true, message: 'Porfavor ingrese el nombre de la escuela' }]}>
          <Input placeholder="Nombre de la escuela" />
        </Form.Item>
        <Form.Item name={['address', 'address1']} rules={[{ required: true, message: 'Porfavor ingrese una calle y número' }]}>
          <Input placeholder="Calle y Número" />
        </Form.Item>
        <Form.Item name={['address', 'address2']} rules={[{ required: true, message: 'Porfavor ingrese una Colonia' }]}>
          <Input placeholder="Colonia" />
        </Form.Item>
        <Form.Item name={['address', 'city']} rules={[{ required: true, message: 'Porfavor ingrese una Ciudad' }]}>
          <Input placeholder="Ciudad" />
        </Form.Item>
        <Form.Item name={['address', 'state']} rules={[{ required: true, message: 'Porfavor ingrese un Estado' }]}>
          <Input placeholder="Estado" />
        </Form.Item>
        <Form.Item name={['address', 'postalCode']} rules={[{ required: true, message: 'Porfavor ingrese un codigo postal' }]}>
          <Input placeholder="Código Postal" />
        </Form.Item>
        <Form.Item name={['address', 'country']} rules={[{ required: true, message: 'Porfavor ingrese un Pais' }]}>
          <Input placeholder="País" />
        </Form.Item>
        <Form.Item name="number" rules={[{ required: true, message: 'Porfavor ingrese el numero de primaria' }]}>
          <Input placeholder="Número de primaria"  />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
          <Button type="primary" htmlType="submit">Registrar</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterSchools;
