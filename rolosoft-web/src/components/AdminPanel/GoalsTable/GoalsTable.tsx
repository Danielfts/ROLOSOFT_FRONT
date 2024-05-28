import { Button, Table, Modal, message, Image, InputNumber } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

type ScoringTableEntry = {
  studentId: string;
  firstName: string;
  lastName: string;
  teamName: string;
  goals: number;
  position: number;
  points: number;
  schoolId: string;
  playerPhotoUrl: string;
  teamPhotoUrl: string;
};

function GoalsTable() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingPlayer, setEditingPlayer] = useState<ScoringTableEntry | null>(null);
  const [dataSource, setDataSource] = useState<ScoringTableEntry[]>([]);

  useEffect(() => {
    fetchScoringTable();
  }, []);

  const fetchScoringTable = async () => {
    const tournamentId = localStorage.getItem('selectedTournamentId');
    if (!tournamentId) {
      message.error('No tournament ID found');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: token };

    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/scoring-table`, { headers });
      if (response.status === 200 && response.data.success) {
        setDataSource(response.data.data);
      } else {
        message.error('Failed to fetch scoring table');
      }
    } catch (error) {
      message.error('Error fetching scoring table');
    }
  };

  const columns = [
    {
      key: "1",
      title: "Posición",
      dataIndex: "position",
      sorter: (a: ScoringTableEntry, b: ScoringTableEntry) => a.position - b.position,
    },
    {
      key: "2",
      title: "Nombre",
      dataIndex: "firstName",
      sorter: (a: ScoringTableEntry, b: ScoringTableEntry) => a.firstName.localeCompare(b.firstName),
    },
    {
      key: "3",
      title: "Apellido",
      dataIndex: "lastName",
      sorter: (a: ScoringTableEntry, b: ScoringTableEntry) => a.lastName.localeCompare(b.lastName),
    },
    {
      key: "4",
      title: "Equipo",
      dataIndex: "teamName",
      sorter: (a: ScoringTableEntry, b: ScoringTableEntry) => a.teamName.localeCompare(b.teamName),
    },
    {
      key: "5",
      title: "Goles",
      dataIndex: "goals",
      sorter: (a: ScoringTableEntry, b: ScoringTableEntry) => a.goals - b.goals,
    },
    {
      key: "6",
      title: "Imagen Jugador",
      dataIndex: "playerPhotoUrl",
      render: (playerPhotoUrl: string) => (
        <Image width={50} src={playerPhotoUrl} />
      ),
    },
    {
      key: "7",
      title: "Imagen Equipo",
      dataIndex: "teamPhotoUrl",
      render: (teamPhotoUrl: string) => (
        <Image width={50} src={teamPhotoUrl} />
      ),
    },
    {
      key: "8",
      title: "Acciones",
      render: (record: ScoringTableEntry) => (
        <>
          <EditOutlined onClick={() => onEditPlayer(record)} />
          <DeleteOutlined onClick={() => onDeletePlayer(record)} style={{ color: "red", marginLeft: 12 }} />
        </>
      ),
    },
  ];

  const onAddPlayer = () => {
    const newId = Math.floor(Math.random() * 10000).toString();
    const newPlayer: ScoringTableEntry = {
      studentId: newId,
      firstName: `New Player ${newId}`,
      lastName: "Last Name",
      teamName: "New Team",
      goals: 0,
      position: dataSource.length + 1,
      points: 0,
      schoolId: newId,
      playerPhotoUrl: "https://via.placeholder.com/50",
      teamPhotoUrl: "https://via.placeholder.com/50",
    };
    setDataSource((prev) => [...prev, newPlayer]);
  };

  const onDeletePlayer = (record: ScoringTableEntry) => {
    Modal.confirm({
      title: "¿Estás seguro de que quieres eliminar este jugador?",
      okText: "Sí",
      okType: "danger",
      onOk: () => {
        setDataSource((prev) => prev.filter((player) => player.studentId !== record.studentId));
      },
    });
  };

  const onEditPlayer = (record: ScoringTableEntry) => {
    setIsEditing(true);
    setEditingPlayer({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingPlayer(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Table columns={columns} dataSource={dataSource} rowKey="studentId" />
        <Modal
          title="Editar Jugador"
          open={isEditing}
          okText="Guardar"
          onCancel={resetEditing}
          onOk={() => {
            setDataSource((prev) =>
              prev.map((player) => (player.studentId === editingPlayer?.studentId ? editingPlayer : player))
            );
            resetEditing();
          }}
        >
          <InputNumber
            min={0}
            style={{ margin: "10px 0" }}
            value={editingPlayer?.goals}
            onChange={(goals) =>
              setEditingPlayer((prev) =>
                prev ? { ...prev, goals: goals || 0 } : null
              )
            }
          />
        </Modal>
      </header>
    </div>
  );
}

export default GoalsTable;
