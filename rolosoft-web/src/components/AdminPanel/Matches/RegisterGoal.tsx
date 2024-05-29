import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

type Goal = {
    id: string;
    name: string;
    lastName: string;
    minute: number;
    playerNumber: number;
};

type Team = {
    id: string;
    name: string;
    goals: Goal[];
};

type Match = {
    id: string;
    teamA: Team;
    teamB: Team;
    dateTimeStart: string;
    dateTimeEnd: string;
};

type Student = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    CURP: string;
};

type RegisterGoalProps = {
    match: Match | null;
    onClose: () => void;
};

const MAX_COUNT = 1;

const RegisterGoal: React.FC<RegisterGoalProps> = ({ match, onClose }) => {
    const [form] = Form.useForm();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

    useEffect(() => {
        if (selectedTeam) {
            fetchPlayers(selectedTeam);
        }
    }, [selectedTeam]);

    const fetchPlayers = async (teamId: string) => {
        const tournamentId = localStorage.getItem('selectedTournamentId');
        if (!tournamentId) {
            message.error('No tournament ID found');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: token };
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools/${teamId}/players`,
                { headers }
            );
            if (response.status === 200 && response.data.success) {
                setStudents(response.data.data);
            } else {
                message.error('Failed to fetch players');
            }
        } catch (error) {
            message.error('Error fetching players');
        }
    };

    const handleStudentSelect = (value: string) => {
        const selected = students.find(s => s.id === value);
        setSelectedStudent(selected || null);
    };

    const onSubmit = async (values: any) => {
        if (!values.team || !selectedStudent || values.minute === undefined) {
            message.error('Please fill all fields');
            return;
        }

        const tournamentId = localStorage.getItem('selectedTournamentId');
        const matchId = match?.id;
        if (!tournamentId || !matchId) {
            message.error('No tournament or match ID found');
            return;
        }

        const payload = {
            student: { id: selectedStudent.id },
            school: { id: values.team },
            minute: values.minute,
        };

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: token };
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/matches/${matchId}`,
                payload,
                { headers }
            );

            if (response.status === 201 && response.data.success) {
                message.success('Goal registered successfully');
                onClose();
                form.resetFields();
            } else {

                message.error('Failed to register goal');
            }
        } catch (error) {
            message.error('Error registering goal');
        }
    };

    return (
        <Form form={form} onFinish={onSubmit} layout="vertical">
            <Form.Item name="team" rules={[{ required: true, message: 'Seleccione un equipo' }]}>
                <Select
                    placeholder="Selecciona un equipo"
                    onChange={(teamId) => setSelectedTeam(teamId as string)}
                >
                    <Option key={match?.teamA.id} value={match?.teamA.id}>{match?.teamA.name}</Option>
                    <Option key={match?.teamB.id} value={match?.teamB.id}>{match?.teamB.name}</Option>
                </Select>
            </Form.Item>
            <Form.Item name="player" rules={[{ required: true, message: 'Seleccione un jugador' }]}>
                <Select
                    placeholder="Seleccione jugador"
                    onChange={handleStudentSelect}
                    value={selectedStudent ? selectedStudent.id : undefined}
                >
                    {students.map(student => (
                        <Select.Option key={student.id} value={student.id}>
                            {`${student.firstName} ${student.lastName} - ${student.email} - ${student.CURP}`}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="minute" rules={[{ required: true, message: 'Ingrese el minuto del gol' }]}>
                <Input
                    type="number"
                    placeholder="Minuto del gol"
                />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
                <Button type="primary" htmlType="submit">
                    Registrar Gol
                </Button>
            </Form.Item>
        </Form>
    );
};

export default RegisterGoal;
