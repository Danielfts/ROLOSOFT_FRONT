import React, { useState, useEffect } from "react";
import { Form, Select, Button, message, DatePicker } from "antd";
import axios from "axios";

const { RangePicker } = DatePicker;

type Team = {
    id: string;
    name: string;
};

type Phase = {
    id: string;
    name: string;
};

type RegisterMatchProps = {
    onClose: () => void;
};

const RegisterMatch: React.FC<RegisterMatchProps> = ({ onClose }) => {
    const [form] = Form.useForm();
    const [teams, setTeams] = useState<Team[]>([]);
    const [phases, setPhases] = useState<Phase[]>([]);
    const [teamA, setTeamA] = useState<string | null>(null);
    const [teamB, setTeamB] = useState<string | null>(null);
    const [phase, setPhase] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeams = async () => {
            const token = localStorage.getItem("token");
            const headers = { Authorization: token };
            const tournamentId = localStorage.getItem("selectedTournamentId");
            if (!tournamentId) {
                message.error("No tournament ID found");
                return;
            }
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools?registered=true`,
                    { headers }
                );
                if (response.status === 200 && response.data.success && Array.isArray(response.data.data)) {
                    setTeams(response.data.data);
                } else {
                    message.error("Failed to fetch teams");
                }
            } catch (error) {
                message.error("Error fetching teams");
            }
        };

        const fetchPhases = async () => {
            const token = localStorage.getItem("token");
            const headers = { Authorization: token };
            const tournamentId = localStorage.getItem("selectedTournamentId");
            if (!tournamentId) {
                message.error("No tournament ID found");
                return;
            }
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/phases`,
                    { headers }
                );
                if (response.status === 200 && response.data.success && Array.isArray(response.data.data)) {
                    setPhases(response.data.data);
                } else {
                    message.error("Failed to fetch phases");
                }
            } catch (error) {
                message.error("Error fetching phases");
            }
        };

        fetchTeams();
        fetchPhases();
    }, []);

    const handleSubmit = async (values: any) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: token };
        const tournamentId = localStorage.getItem("selectedTournamentId");
        const payload = {
            startDate: values.dates[0].toISOString(),
            endDate: values.dates[1].toISOString(),
            teamA: {
                id: values.teamA,
            },
            teamB: {
                id: values.teamB,
            },
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/phases/${values.phase}/matches`,
                payload,
                { headers }
            );
            if (response.status === 201) {
                message.success("Match registered successfully!");
                onClose();
                form.resetFields();
                setTeamA(null);
                setTeamB(null);
                setPhase(null);
            } else {
                message.error("Failed to register match");
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                message.error(`Error: ${error.response.data.message}`);
            } else {
                message.error("Error registering match");
            }
        }
    };

    return (
        <div>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                    name="phase"
                    rules={[{ required: true, message: "Please select a phase" }]}
                >
                    <Select
                        placeholder="Select Phase"
                        onChange={(value) => setPhase(value as string)}
                    >
                        {phases.map((phase) => (
                            <Select.Option key={phase.id} value={phase.id}>
                                {phase.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="teamA"
                    rules={[{ required: true, message: "Please select Team A" }]}
                >
                    <Select
                        placeholder="Select Team A"
                        onChange={(value) => setTeamA(value as string)}
                    >
                        {teams.map((team) => (
                            <Select.Option key={team.id} value={team.id}>
                                {team.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="teamB"
                    rules={[{ required: true, message: "Please select Team B" }]}
                >
                    <Select
                        placeholder="Select Team B"
                        onChange={(value) => setTeamB(value as string)}
                    >
                        {teams.map((team) => (
                            <Select.Option key={team.id} value={team.id}>
                                {team.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="dates" rules={[{ required: true, message: "Please select the dates" }]}>
                    <RangePicker showTime placeholder={['Start Date', 'End Date']} format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
                    <Button type="primary" htmlType="submit">
                        Register Match
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterMatch;
