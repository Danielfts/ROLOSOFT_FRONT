import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, message, Descriptions, List, Avatar } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaFutbol } from 'react-icons/fa';
import RegisterMatch from "./RegisterMatch";
import RegisterGoal from "./RegisterGoal";

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

type Phase = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingMatch, setViewingMatch] = useState<Match | null>(null);
  const [isRegisteringMatch, setIsRegisteringMatch] = useState<boolean>(false);
  const [isRegisteringPhase, setIsRegisteringPhase] = useState<boolean>(false);
  const [isViewingPhase, setIsViewingPhase] = useState<boolean>(false);
  const [viewingPhase, setViewingPhase] = useState<Phase | null>(null);
  const [isRegisteringGoal, setIsRegisteringGoal] = useState<boolean>(false); 
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  useEffect(() => {
    fetchMatches();
    fetchPhases();
  }, []);

  const fetchMatches = async () => {
    const tournamentId = localStorage.getItem("selectedTournamentId");
    if (!tournamentId) {
      message.error("No tournament ID found");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: token };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/matches`,
        { headers }
      );
      if (response.status === 200 && response.data.success) {
        setMatches(response.data.data);
      } else {
        message.error("Failed to fetch matches");
      }
    } catch (error) {
      message.error("Error fetching matches");
    }
  };

  const fetchPhases = async () => {
    const tournamentId = localStorage.getItem("selectedTournamentId");
    if (!tournamentId) {
      message.error("No tournament ID found");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: token };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/phases`,
        { headers }
      );
      if (response.status === 200 && response.data.success) {
        setPhases(response.data.data);
      } else {
        message.error("Failed to fetch phases");
      }
    } catch (error) {
      message.error("Error fetching phases");
    }
  };

  const matchColumns = [
    {
      key: "1",
      title: "Equipo A",
      dataIndex: ["teamA", "name"],
      sorter: (a: Match, b: Match) => a.teamA.name.localeCompare(b.teamA.name),
    },
    {
      key: "2",
      title: "Total Goles Equipo A",
      render: (record: Match) => record.teamA.goals.length,
    },
    {
      key: "3",
      title: "Equipo B",
      dataIndex: ["teamB", "name"],
      sorter: (a: Match, b: Match) => a.teamB.name.localeCompare(b.teamB.name),
    },
    {
      key: "4",
      title: "Total Goles Equipo B",
      render: (record: Match) => record.teamB.goals.length,
    },
    {
      key: "5",
      title: "Fecha Inicio",
      dataIndex: "dateTimeStart",
      sorter: (a: Match, b: Match) => new Date(a.dateTimeStart).getTime() - new Date(b.dateTimeStart).getTime(),
    },
    {
      key: "6",
      title: "Fecha Fin",
      dataIndex: "dateTimeEnd",
      sorter: (a: Match, b: Match) => new Date(a.dateTimeEnd).getTime() - new Date(b.dateTimeEnd).getTime(),
    },
    {
      key: "7",
      title: "Acciones",
      render: (record: Match) => (
        <>
          <span onClick={() => onRegisterGoal(record)} style={{ marginRight: 12 }}>
            <FaFutbol />
          </span>
          <EyeOutlined onClick={() => onViewMatch(record)} style={{ marginRight: 12 }} />
          <DeleteOutlined onClick={() => onDeleteMatch(record)} style={{ color: "red" }} />
        </>
      ),
    },
  ];  

  const phaseColumns = [
    {
      key: "1",
      title: "Fase",
      dataIndex: "name",
      sorter: (a: Phase, b: Phase) => a.name.localeCompare(b.name),
    },
    {
      key: "2",
      title: "Fecha Inicio",
      dataIndex: "startDate",
      sorter: (a: Phase, b: Phase) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    },
    {
      key: "3",
      title: "Fecha Final",
      dataIndex: "endDate",
      sorter: (a: Phase, b: Phase) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    },
    {
      key: "4",
      title: "Acciones",
      render: (record: Phase) => (
        <>
          <EyeOutlined onClick={() => onViewPhase(record)} />
          <DeleteOutlined onClick={() => onDeletePhase(record)} style={{ color: "red", marginLeft: 12 }} />
        </>
      ),
    },
  ];

  const onViewPhase = (record: Phase) => {
    setIsViewingPhase(true);
    setViewingPhase(record);
  };

  const onViewMatch = (record: Match) => {
    setIsViewing(true);
    setViewingMatch(record);
  };

  const onDeletePhase = (record: Phase) => {
    Modal.confirm({
      title: "Estas seguro que desea eliminar esta fase?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          const headers = { Authorization: token };
          const response = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/phases/${record.id}`,
            { headers }
          );

          if (response.status === 200) {
            setPhases((prev) => prev.filter((phase) => phase.id !== record.id));
            message.success("Fase eliminada exitosamente!");
          } else {
            message.error("Failed to delete phase");
          }
        } catch (error) {
          message.error("Failed to delete phase: " + error);
        }
      },
    });
  };

  const onDeleteMatch = (record: Match) => {
    Modal.confirm({
      title: "Are you sure you want to delete this match?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          const headers = { Authorization: token };
          const response = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/matches/${record.id}`,
            { headers }
          );

          if (response.status === 200) {
            setMatches((prev) => prev.filter((match) => match.id !== record.id));
            message.success("Partido eliminado exitosmente!");
          } else {
            message.error("Failed to delete match");
          }
        } catch (error) {
          message.error("Failed to delete match: " + error);
        }
      },
    });
  };

  const onRegisterMatch = () => {
    setIsRegisteringMatch(true);
  };

  const onRegisterPhase = () => {
    setIsRegisteringPhase(true);
  };

  const onRegisterGoal = (record: Match) => {
    setCurrentMatch(record);
    setIsRegisteringGoal(true);
  };

  return (
    <div>
      <Table columns={phaseColumns} dataSource={phases} rowKey="id" pagination={false} />
      <div style={{ margin: "5%" }}></div>
      <Button type="primary" onClick={onRegisterMatch}>Registrar Nuevo Partido</Button>
      <div style={{ margin: "2%" }}></div>
      <Table columns={matchColumns} dataSource={matches} rowKey="id" />
      <Modal
        title="Detalles del Partido"
        open={isViewing}
        onCancel={() => setIsViewing(false)}
        footer={null}
        width={500}
      >
        {viewingMatch && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Equipo A">
              {viewingMatch.teamA.name}
            </Descriptions.Item>
            <Descriptions.Item label="Goles del Equipo A">
              {viewingMatch.teamA.goals.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={viewingMatch.teamA.goals}
                  renderItem={(goal, index) => (
                    <List.Item key={goal.id}>
                      <List.Item.Meta
                        avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                        title={`${goal.name} ${goal.lastName}`}
                        description={`Minuto: ${goal.minute}`}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div>No goals</div>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Equipo B">
              {viewingMatch.teamB.name}
            </Descriptions.Item>
            <Descriptions.Item label="Goles del Equipo B">
              {viewingMatch.teamB.goals.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={viewingMatch.teamB.goals}
                  renderItem={(goal, index) => (
                    <List.Item key={goal.id}>
                      <List.Item.Meta
                        avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                        title={`${goal.name} ${goal.lastName}`}
                        description={`Minuto: ${goal.minute}`}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div>No goals</div>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha Inicio">
              {viewingMatch.dateTimeStart}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha Fin">
              {viewingMatch.dateTimeEnd}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      <Modal
        title="Detalles de la Fase"
        open={isViewingPhase}
        onCancel={() => setIsViewingPhase(false)}
        footer={null}
        width={500}
      >
        {viewingPhase && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Nombre de la Fase">{viewingPhase.name}</Descriptions.Item>
            <Descriptions.Item label="Fecha de Inicio">{viewingPhase.startDate}</Descriptions.Item>
            <Descriptions.Item label="Fecha de Fin">{viewingPhase.endDate}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      <Modal
        title="Registrar Nuevo Partido"
        open={isRegisteringMatch}
        footer={null}
        onCancel={() => setIsRegisteringMatch(false)}
        width={500}
      >
        <RegisterMatch
          onClose={() => {
            setIsRegisteringMatch(false);
            fetchMatches();
          }}
        />
      </Modal>
      <Modal
        title="Registrar Gol"
        open={isRegisteringGoal}
        footer={null}
        onCancel={() => setIsRegisteringGoal(false)}
        width={500}
      >
        <RegisterGoal
          match={currentMatch}
          onClose={() => {
            setIsRegisteringGoal(false);
            fetchMatches();
          }}
        />
      </Modal>
    </div>
  );
};

export default Matches;
