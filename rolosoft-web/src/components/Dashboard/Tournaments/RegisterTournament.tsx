import React from 'react';
import { Form, Input, DatePicker, Button, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

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

interface RegisterTournamentProps {
    onClose: () => void;
}

const RegisterTournament: React.FC<RegisterTournamentProps> = ({ onClose }) => {
    const [form] = Form.useForm<TournamentFormValues>();

    const handleSubmit = async (values: TournamentFormValues) => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: token };
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
                message.success('Torneo Registrado Exitosamente!');
                form.resetFields();
                onClose(); // Close the modal and refresh the tournaments list
            } else {
                message.error('Failed to register tournament.');
            }
        } catch (error) {
            message.error('An error occurred while registering the tournament.');
            console.error('Registration error:', error);
        }
    };

    return (
        <div>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item name="name" rules={[{ required: true }]}>
                    <Input placeholder="Nombre del torneo" />
                </Form.Item>
                <Form.Item name="dates" label="Fecha de inicio y fin" rules={[{ required: true }]} >
                    <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }}  />
                </Form.Item>
                <Form.Item name="address1" rules={[{ required: true }]}>
                    <Input placeholder="Calle y Número" />
                </Form.Item>
                <Form.Item name="address2" rules={[{ required: true }]}>
                    <Input placeholder="Colonia" />
                </Form.Item>
                <Form.Item name="city" rules={[{ required: true }]}>
                    <Input placeholder="Ciudad" />
                </Form.Item>
                <Form.Item name="state" rules={[{ required: true }]}>
                    <Input placeholder="Estado" />
                </Form.Item>
                <Form.Item name="postalCode" rules={[{ required: true }]}>
                    <Input placeholder="Código Postal" />
                </Form.Item>
                <Form.Item name="country" rules={[{ required: true }]}>
                    <Input placeholder="País" />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
                    <Button type="primary" htmlType="submit">Registrar</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterTournament;
