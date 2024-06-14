import React, { useState, useEffect } from "react";
import { Form, Select, Button, message, DatePicker } from "antd";
import { registerMatch } from "../../../services/matchService";
import { fetchTeam } from "../../../services/teamService";
import { fetchPhase } from "../../../services/phaseService";
import { Team, Phase, RMatch } from "../../../types/types";

const { RangePicker } = DatePicker;

const RegisterMatch: React.FC<RMatch> = ({ onClose }) => {
    const [form] = Form.useForm();
    const [teams, setTeams] = useState<Team[]>([]);
    const [phases, setPhases] = useState<Phase[]>([]);
    const [teamA, setTeamA] = useState<string | null>(null);
    const [teamB, setTeamB] = useState<string | null>(null);
    const [phaseName, setPhaseName] = useState<string | null>(null);

    useEffect(() => {
        const getMatchData = async () => {
            const tournamentId = localStorage.getItem('selectedTournamentId');
            const token = localStorage.getItem('token');

            if (tournamentId && token) {
                try {
                    const teamData = await fetchTeam(token, tournamentId);
                    if (teamData) {
                        setTeams(teamData);
                    } else {
                        message.error("Failed to load team data");
                    }

                    const phaseData = await fetchPhase(token, tournamentId);
                    if (phaseData) {
                        setPhases(phaseData);
                    } else {
                        message.error("Failed to load phase data");
                    }
                } catch (error) {
                    message.error("Error fetching data");
                }
            } else {
                message.error('No tournament ID or token found');
            }
        };
        getMatchData();
    }, []);

    const handleSubmit = async (values: any) => {
        const tournamentId = localStorage.getItem("selectedTournamentId");
        const token = localStorage.getItem('token');
        if (tournamentId && token && phaseName) {
            const payload = {
                startDateTime: values.dates[0].toISOString(),
                endDateTime: values.dates[1].toISOString(),
                schoolA: { id: values.teamA },
                schoolB: { id: values.teamB },
            };

            if (await registerMatch(token, tournamentId, phaseName, payload)) {
                onClose();
                form.resetFields();
                setTeamA(null);
                setTeamB(null);
                setPhaseName(null);
            }
        } else {
            message.error('No tournament ID, token, or phase ID found');
        }
    };

    return (
        <div>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                    name="phase"
                    rules={[{ required: true, message: "Por favor seleccione una fase" }]}
                >
                    <Select
                        placeholder="Seleccione una fase"
                        onChange={(value) => setPhaseName(value as string)}
                    >
                        {phases.map((phase) => (
                            <Select.Option key={phase.id} value={phase.name}>
                                {phase.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="teamA"
                    rules={[{ required: true, message: "Por favor seleccione equipo A" }]}
                >
                    <Select
                        placeholder="Seleccione equipo A"
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
                    rules={[{ required: true, message: "Por favor seleccione equipo B" }]}
                >
                    <Select
                        placeholder="Seleccione equipo B"
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
                    <RangePicker showTime placeholder={['Fecha Inicio', 'Fecha Fin']} format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
                    <Button type="primary" htmlType="submit">
                        Registrar
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterMatch;
