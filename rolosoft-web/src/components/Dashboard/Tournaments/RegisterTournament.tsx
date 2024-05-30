// RegisterTournament.tsx
import React from 'react';
import { Form, Input, DatePicker, Button, message } from 'antd';
import moment from 'moment';
import { registerTournament } from '../../../services/tournamentService';
import { Tournament } from '../../../types/types';

const { RangePicker } = DatePicker;

interface RegisterTournamentProps {
    onClose: () => void;
}

const RegisterTournament: React.FC<RegisterTournamentProps> = ({ onClose }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        const token = localStorage.getItem('token');

        if (!token) {
            message.error('No se encontró ningun token, por favor inicie sesión');
            return;
        }

        const payload: Omit<Tournament, 'id'> = {
            name: values.name,
            startDate: values.dates[0].format('YYYY-MM-DD'),
            endDate: values.dates[1].format('YYYY-MM-DD'),
            address: {
                address1: values.address1,
                address2: values.address2,
                city: values.city,
                state: values.state,
                postalCode: values.postalCode,
                country: values.country,
            },
        };

        const success = await registerTournament(token, payload);
        if (success) {
            form.resetFields();
            onClose();
        }
    };

    return (
        <div>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item name="name" rules={[{ required: true, message: 'Please enter the tournament name' }]}>
                    <Input placeholder="Nombre del torneo" />
                </Form.Item>
                <Form.Item name="dates" rules={[{ required: true, message: 'Please select the dates' }]}>
                    <RangePicker placeholder={['Fecha Inicio', 'Fecha Fin']} format="YYYY-MM-DD" style={{ width: '100%' }} />
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
                <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
                    <Button type="primary" htmlType="submit">Registrar</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterTournament;
