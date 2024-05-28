import React, { useState, useEffect } from "react";
import { Form, Select, Input, Button, message } from "antd";
import axios from "axios";

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

type RegisterGoalProps = {
  match: Match | null;
  onClose: () => void;
};

const RegisterGoal: React.FC<RegisterGoalProps> = ({ match, onClose }) => {
  const [players, setPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [minute, setMinute] = useState<number | null>(null);

  useEffect(() => {
    if (selectedTeam) {
      fetchPlayers(selectedTeam);
    }
  }, [selectedTeam]);

  const fetchPlayers = async (teamId: string) => {
    const tournamentId = localStorage.getItem("selectedTournamentId");
    if (!tournamentId) {
      message.error("No tournament ID found");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: token };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/teams/${teamId}/players`,
        { headers }
      );
      if (response.status === 200 && response.data.success) {
        setPlayers(response.data.data);
      } else {
        message.error("Failed to fetch players");
      }
    } catch (error) {
      message.error("Error fetching players");
    }
  };

  const onSubmit = async () => {
    if (!selectedTeam || !selectedPlayer || !minute) {
      message.error("Please fill all fields");
      return;
    }

    const tournamentId = localStorage.getItem("selectedTournamentId");
    const matchId = match?.id;
    if (!tournamentId || !matchId) {
      message.error("No tournament or match ID found");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: token };
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/matches/${matchId}/goals`,
        {
          student: { id: selectedPlayer },
          school: { id: selectedTeam },
          minute,
        },
        { headers }
      );

      if (response.status === 200 && response.data.success) {
        message.success("Goal registered successfully");
        onClose();
      } else {
        message.error("Failed to register goal");
      }
    } catch (error) {
      message.error("Error registering goal");
    }
  };

  return (
    <Form layout="vertical">
      <Form.Item>
        <Select
          placeholder="Selecciona un equipo"
          onChange={(value) => setSelectedTeam(value as string)}
        >
          <Option value={match?.teamA.id}>{match?.teamA.name}</Option>
          <Option value={match?.teamB.id}>{match?.teamB.name}</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Select
          placeholder="Selecciona un jugador"
          onChange={(value) => setSelectedPlayer(value as string)}
        >
          {players.map((player: any) => (
            <Option key={player.id} value={player.id}>
              {player.name} {player.lastName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Input
          type="number"
          placeholder="Minuto del gol"
          value={minute ?? ""}
          onChange={(e) => setMinute(parseInt(e.target.value))}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
        <Button type="primary" onClick={onSubmit}>
          Registrar Gol
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterGoal;
