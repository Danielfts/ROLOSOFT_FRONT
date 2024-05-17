import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, DatePicker } from "antd";
import axios from "axios";

const { RangePicker } = DatePicker;

type RegisterPhaseProps = {
    onClose: () => void;
};

const RegisterPhase: React.FC<RegisterPhaseProps> = ({ onClose }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: token };
        const tournamentId = localStorage.getItem("selectedTournamentId");

        const payload = {
            tournament: {
                id: tournamentId,
            },
            name: values.name,
            startDate: values.dates[0].format("YYYY-MM-DD"),
            endDate: values.dates[1].format("YYYY-MM-DD"),
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/phases`,
                payload,
                { headers }
            );
            if (response.status === 201) {
                message.success("Phase registered successfully!");
                onClose();
                form.resetFields();
            } else {
                message.error("Failed to register phase");
            }
        } catch (error) {
            message.error("Error registering phase");
        }
    };

    return (
        <div>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: "Please input the phase name" }]}
                >
                    <Input placeholder="Nombre de la Fase" />
                </Form.Item>
                <Form.Item
                    name="dates"
                    rules={[{ required: true, message: "Please select the dates" }]}
                >
                    <RangePicker placeholder={['Fecha Inicio', 'Fecha Fin']} format="YYYY-MM-DD" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
                    <Button type="primary" htmlType="submit">
                        Registrar Fase
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterPhase;
