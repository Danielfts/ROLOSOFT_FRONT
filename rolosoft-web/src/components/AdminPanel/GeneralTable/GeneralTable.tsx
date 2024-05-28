import { Button, Table, Modal, InputNumber } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// Define a type for team standings
type TeamStanding = {
  id: number;
  team: string;
  points: number;
  goalDifference: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesDrawn: number;
  gamesLost: number;
  goalsFor: number;
  goalsAgainst: number;
};

function GeneralTable() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<TeamStanding | null>(null);
  const [dataSource, setDataSource] = useState<TeamStanding[]>([
    {
      id: 1,
      team: "FC Barcelona",
      points: 88,
      goalDifference: 45,
      gamesPlayed: 38,
      gamesWon: 28,
      gamesDrawn: 4,
      gamesLost: 6,
      goalsFor: 90,
      goalsAgainst: 45,
    },
    {
      id: 2,
      team: "Real Madrid",
      points: 86,
      goalDifference: 40,
      gamesPlayed: 38,
      gamesWon: 26,
      gamesDrawn: 8,
      gamesLost: 4,
      goalsFor: 85,
      goalsAgainst: 45,
    },
  ]);

  const columns = [
    {
      key: "1",
      title: "Posición Equipo",
      dataIndex: "team",
      sorter: (a: TeamStanding, b: TeamStanding) => a.team.localeCompare(b.team),
    },
    {
      key: "2",
      title: "PT",
      dataIndex: "points",
      sorter: (a: TeamStanding, b: TeamStanding) => a.points - b.points,
    },
    {
      key: "3",
      title: "DF",
      dataIndex: "goalDifference",
      sorter: (a: TeamStanding, b: TeamStanding) => a.goalDifference - b.goalDifference,
    },
    {
      key: "4",
      title: "JJ",
      dataIndex: "gamesPlayed",
      sorter: (a: TeamStanding, b: TeamStanding) => a.gamesPlayed - b.gamesPlayed,
    },
    {
      key: "5",
      title: "JG",
      dataIndex: "gamesWon",
      sorter: (a: TeamStanding, b: TeamStanding) => a.gamesWon - b.gamesWon,
    },
    {
      key: "6",
      title: "JE",
      dataIndex: "gamesDrawn",
      sorter: (a: TeamStanding, b: TeamStanding) => a.gamesDrawn - b.gamesDrawn,
    },
    {
      key: "7",
      title: "JP",
      dataIndex: "gamesLost",
      sorter: (a: TeamStanding, b: TeamStanding) => a.gamesLost - b.gamesLost,
    },
    {
      key: "8",
      title: "GF",
      dataIndex: "goalsFor",
      sorter: (a: TeamStanding, b: TeamStanding) => a.goalsFor - b.goalsFor,
    },
    {
      key: "9",
      title: "GC",
      dataIndex: "goalsAgainst",
      sorter: (a: TeamStanding, b: TeamStanding) => a.goalsAgainst - b.goalsAgainst,
    },
    {
      key: "10",
      title: "Acciones",
      render: (record: TeamStanding) => (
        <>
          <EditOutlined
            onClick={() => {
              onEditTeam(record);
            }}
          />
          <DeleteOutlined
            onClick={() => {
              onDeleteTeam(record);
            }}
            style={{ color: "red", marginLeft: 12 }}
          />
        </>
      ),
    },
  ];

  const onAddTeam = () => {
    const newId = Math.floor(Math.random() * 10000);
    const newTeam: TeamStanding = {
      id: newId,
      team: "New Team " + newId,
      points: 0,
      goalDifference: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      gamesDrawn: 0,
      gamesLost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    };
    setDataSource((prev) => [...prev, newTeam]);
  };

  const onDeleteTeam = (record: TeamStanding) => {
    Modal.confirm({
      title: "¿Estás seguro de que quieres eliminar este equipo?",
      okText: "Sí",
      okType: "danger",
      onOk: () => {
        setDataSource((prev) => prev.filter((team) => team.id !== record.id));
      },
    });
  };

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
        <Button type="primary" onClick={onAddTeam}>Agregar Nuevo Equipo</Button>
        <div style={{ margin: "2%" }}></div>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          title="Editar Equipo"
          open={isEditing}
          okText="Guardar"
          onCancel={resetEditing}
          onOk={() => {
            setDataSource((prev) =>
              prev.map((team) =>
                team.id === editingTeam?.id ? editingTeam : team
              )
            );
            resetEditing();
          }}
        >
          {/* Inputs for editing team details */}
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
          {/* Additional inputs for games played, won, drawn, lost, goals for, and goals against */}
        </Modal>
      </header>
    </div>
  );
}

export default GeneralTable;
