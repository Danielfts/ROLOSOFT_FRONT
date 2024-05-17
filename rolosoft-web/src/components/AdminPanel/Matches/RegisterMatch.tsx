import React, { useState, useEffect } from "react";
import { Form, Select, Button, message, DatePicker } from "antd";
import axios from "axios";
import moment from "moment";

const { RangePicker } = DatePicker;

type Team = {
    id: string;
    name: string;
};

type RegisterMatchProps = {
    onClose: () => void;
};

const RegisterMatch: React.FC<RegisterMatchProps> = ({ onClose }) => {
    const [form] = Form.useForm();
    const [teams, setTeams] = useState<Team[]>([]);
    const [teamA, setTeamA] = useState<string | null>(null);
    const [teamB, setTeamB] = useState<string | null>(null);

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
                    `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/teams`,
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

        fetchTeams();
    }, []);

    const handleSubmit = async (values: any) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: token };
        const tournamentId = localStorage.getItem("selectedTournamentId");
        const payload = {
            startDate: values.startDate.toISOString(),
            endDate: values.endDate.toISOString(),
            teamA: {
                id: values.teamA,
            },
            teamB: {
                id: values.teamB,
            },
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/matches`,
                payload,
                { headers }
            );
            if (response.status === 201) {
                message.success("Match registered successfully!");
                onClose();
                form.resetFields();
                setTeamA(null);
                setTeamB(null);
            } else {
                message.error("Failed to register match");
            }
        } catch (error) {
            message.error("Error registering match");
        }
    };

    return (
        <div>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                    name="teamA"
                    rules={[{ required: true, message: "Select Team A" }]}
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
                    rules={[{ required: true, message: "Select Team B" }]}
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

                <Form.Item name="dates" label="Fecha de inicio y fin" rules={[{ required: true }]} >
                    <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Register Match
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterMatch;
