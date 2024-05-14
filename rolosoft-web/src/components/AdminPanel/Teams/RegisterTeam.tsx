import React from 'react';
import { Form, Input, DatePicker, Button, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

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

interface TournamentFormValues {
    name: string;
    dates: [moment.Moment, moment.Moment];
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

const RegisterTeam: React.FC = () => {
    const [form] = Form.useForm<TournamentFormValues>();

    const handleSubmit = async (values: TournamentFormValues) => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: token};
        const { name, dates, address1, address2, city, state, postalCode, country } = values;
        const payload = {
            name,
            startDate: dates[0].format('YYYY-MM-DD'),
            endDate: dates[1].format('YYYY-MM-DD'),
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
            const response = await axios.post(process.env.REACT_APP_TOURNAMENTS_API_URL!, payload, { headers });
            if (response.status === 201) {
                message.success('Torneo Regsitrado Exitosamente!');
                form.resetFields();
            } else {
                message.error('Failed to register tournament.');
            }
        } catch (error) {
            message.error('An error occurred while registering the tournament.');
            console.error('Registration error:', error);
        }
    };

    return (
        <div style={formContainerStyle}>
            <Form form={form} onFinish={handleSubmit} style={formStyle} layout="vertical">
                <Form.Item name="name" label="Nombre del torneo" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="dates" label="Fecha de inicio y fin" rules={[{ required: true }]}>
                    <RangePicker format="YYYY-MM-DD" />
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

export default RegisterTeam;
