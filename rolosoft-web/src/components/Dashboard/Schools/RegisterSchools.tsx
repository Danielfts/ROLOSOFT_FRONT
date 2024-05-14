import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const formContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '5%',
};

const formStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '500px',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

interface SchoolFormValues {
    name: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

const RegisterSchools: React.FC = () => {
    const [form] = Form.useForm<SchoolFormValues>();

    const handleSubmit = async (values: SchoolFormValues) => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: token };
        const { name, address1, address2, city, state, postalCode, country } = values;
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
        };

        try {
            const response = await axios.post(process.env.REACT_APP_SCHOOLS_API_URL!, payload, { headers });
            if (response.status === 201) {
                message.success('Escuela registrada exitosamente!');
                form.resetFields();
            } else {
                message.error('Failed to register school.');
            }
        } catch (error) {
            message.error('An error occurred while registering the school.');
            console.error('Registration error:', error);
        }
    };

    return (
        <div style={formContainerStyle}>
            <Form form={form} onFinish={handleSubmit} style={formStyle} layout="vertical">
                <Form.Item name="name" label="Nombre de la escuela" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="address1" label="Calle y Número" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="address2" label="Colonia" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="city" label="Ciudad" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="state" label="Estado" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="postalCode" label="Código Postal" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="country" label="País" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Registrar</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterSchools;
