import { Button, Table, Modal, message, Image, InputNumber, Tooltip } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

type TeamStanding = {
  team: string;
  victories: number;
  draws: number;
  defeats: number;
  position: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  gamesPlayed: number;
  photoUrl: string;
};

function GeneralTable() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<TeamStanding | null>(null);
  const [dataSource, setDataSource] = useState<TeamStanding[]>([]);

  useEffect(() => {
    fetchGeneralTable();
  }, []);

  const fetchGeneralTable = async () => {
    const tournamentId = localStorage.getItem('selectedTournamentId');
    if (!tournamentId) {
      message.error('No tournament ID found');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: token };

    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/general-table`, { headers });
      if (response.status === 200 && response.data.success) {
        setDataSource(response.data.data);
      } else {
        message.error('Failed to fetch general table');
      }
    } catch (error) {
      message.error('Error fetching general table');
    }
  };

  const columns = [
    {
      key: "1",
      title: "Posición",
      dataIndex: "position",
      sorter: (a: TeamStanding, b: TeamStanding) => a.position - b.position,
    },
    {
      key: "2",
      title: "Escudo",
      dataIndex: "photoUrl",
      render: (photoUrl: string) => (
        <Image width={50} src={photoUrl} />
      ),
    },
    {
      key: "3",
      title: "Equipo",
      dataIndex: "team",
      sorter: (a: TeamStanding, b: TeamStanding) => a.team.localeCompare(b.team),
    },
    {
      key: "4",
      title: (
        <div>
          PT
          <Tooltip title="Número de puntos">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "points",
      sorter: (a: TeamStanding, b: TeamStanding) => a.points - b.points,
    },
    {
      key: "5",
      title: (
        <div>
          DIF
          <Tooltip title="Diferencia de goles">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "goalDifference",
      sorter: (a: TeamStanding, b: TeamStanding) => a.goalDifference - b.goalDifference,
    },
    {
      key: "6",
      title: (
        <div>
          JJ
          <Tooltip title="Juegos jugados">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "gamesPlayed",
      sorter: (a: TeamStanding, b: TeamStanding) => a.gamesPlayed - b.gamesPlayed,
    },
    {
      key: "7",
      title: (
        <div>
          JG
          <Tooltip title="Juegos ganados">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "victories",
      sorter: (a: TeamStanding, b: TeamStanding) => a.victories - b.victories,
    },
    {
      key: "8",
      title: (
        <div>
          JE
          <Tooltip title="Juegos empatados">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "draws",
      sorter: (a: TeamStanding, b: TeamStanding) => a.draws - b.draws,
    },
    {
      key: "9",
      title: (
        <div>
          JP
          <Tooltip title="Juegos perdidos">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "defeats",
      sorter: (a: TeamStanding, b: TeamStanding) => a.defeats - b.defeats,
    },
    {
      key: "10",
      title: (
        <div>
          GF
          <Tooltip title="Goles a favor">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "goalsFor",
      sorter: (a: TeamStanding, b: TeamStanding) => a.goalsFor - b.goalsFor,
    },
    {
      key: "11",
      title: (
        <div>
          GC
          <Tooltip title="Goles en contra">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "goalsAgainst",
      sorter: (a: TeamStanding, b: TeamStanding) => a.goalsAgainst - b.goalsAgainst,
    },
    {
      key: "12",
      title: "Acciones",
      render: (record: TeamStanding) => (
        <>
          <EditOutlined onClick={() => onEditTeam(record)} />
        </>
      ),
    },
  ];



  const onEditTeam = (record: TeamStanding) => {
    setIsEditing(true);
    setEditingTeam({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingTeam(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Table columns={columns} dataSource={dataSource} rowKey="team" />
        <Modal
          title="Editar Equipo"
          open={isEditing}
          okText="Guardar"
          onCancel={resetEditing}
          onOk={() => {
            setDataSource((prev) =>
              prev.map((team) => (team.team === editingTeam?.team ? editingTeam : team))
            );
            resetEditing();
          }}
        >
          <InputNumber
            min={0}
            style={{ margin: "10px 0" }}
            value={editingTeam?.points}
            onChange={(points) =>
              setEditingTeam((prev) =>
                prev ? { ...prev, points: points || 0 } : null
              )
            }
          />
          <InputNumber
            min={-100}
            max={100}
            style={{ margin: "10px 0" }}
            value={editingTeam?.goalDifference}
            onChange={(goalDifference) =>
              setEditingTeam((prev) =>
                prev ? { ...prev, goalDifference: goalDifference || 0 } : null
              )
            }
          />
        </Modal>
      </header>
    </div>
  );
}

export default GeneralTable;
