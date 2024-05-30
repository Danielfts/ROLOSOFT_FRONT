import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message } from 'antd';
import { registerGoal } from "../../../services/goalService";
import { fetchRegisteredStudent } from "../../../services/studentService";
import { Student, RGoal } from '../../../types/types';

const { Option } = Select;

const RegisterGoal: React.FC<RGoal> = ({ match, onClose }) => {
    const [form] = Form.useForm();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            const tournamentId = localStorage.getItem('selectedTournamentId');
            const token = localStorage.getItem('token');

            if (tournamentId && token) {
                try {
                    const studentData = await fetchRegisteredStudent(token, tournamentId);
                    if (studentData) {
                        setStudents(studentData);
                    } else {
                        message.error("Failed to load player data");
                    }
                } catch (error) {
                    message.error("Error fetching data");
                }
            } else {
                message.error('No tournament ID or token found');
            }
        };
        if (selectedTeam) {
            fetchPlayers();
        }
    }, [selectedTeam]);

    const handleStudentSelect = (value: string) => {
        const selected = students.find(s => s.id === value);
        setSelectedStudent(selected || null);
    };

    const handleSubmit = async (values: any) => {
        if (!values.team || !selectedStudent || values.minute === undefined) {
            message.error('Please fill all fields');
            return;
        }

        const tournamentId = localStorage.getItem('selectedTournamentId');
        const matchId = match?.id;
        const token = localStorage.getItem('token');
        if (tournamentId && matchId && token) {
            const payload = {
                student: { id: selectedStudent.id },
                school: { id: values.team },
                minute: values.minute,
            };

            try {
                if (await registerGoal(token, tournamentId, matchId, payload)) {
                    onClose();
                    form.resetFields();
                    setSelectedTeam(null);
                    setSelectedStudent(null);
                }
            } catch (error) {
                message.error('Error registering goal');
            }
        } else {
            message.error('No tournament ID, match ID, or token found');
        }
    };

    return (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
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
