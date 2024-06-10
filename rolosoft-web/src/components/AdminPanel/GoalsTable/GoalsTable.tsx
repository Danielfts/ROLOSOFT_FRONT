import { Button, Table, Modal, message, Image, InputNumber } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { GoalT } from "../../../types/types";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchGoalTable } from "../../../services/statisticTableService";

function GoalsTable() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingPlayer, setEditingPlayer] = useState<GoalT | null>(null);
  const [dataSource, setDataSource] = useState<GoalT[]>([]);

  useEffect(() => {
    const getGoalTable = async () => {
      const tournamentId = localStorage.getItem('selectedTournamentId');
      const token = localStorage.getItem('token');

      if (tournamentId && token) {
        try {
          const data = await fetchGoalTable(token, tournamentId);
          if (data) {
            setDataSource(data);
          } else {
            message.error("Failed to load data");
          }
        } catch (error) {
          message.error("Error fetching data");
        }
      } else {
        message.error('No tournament ID or token found');
      }
    };
    getGoalTable();
  }, []);

  const columns = [
    {
      key: "1",
      title: "Posición",
      dataIndex: "position",
      sorter: (a: GoalT, b: GoalT) => a.position - b.position,
    },
    {
      key: "8",
      title: "Imagen Equipo",
      dataIndex: "teamPhotoUrl",
      render: (teamPhotoUrl: string) => (
        <Image width={50} src={teamPhotoUrl} />
      ),
    },
    {
      key: "7",
      title: "Imagen Jugador",
      dataIndex: "playerPhotoUrl",
      render: (playerPhotoUrl: string) => (
        <Image width={50} src={playerPhotoUrl} />
      ),
    },
    {
      key: "2",
      title: "Nombre",
      dataIndex: "firstName",
      sorter: (a: GoalT, b: GoalT) => a.firstName.localeCompare(b.firstName),
    },
    {
      key: "3",
      title: "Apellido",
      dataIndex: "lastName",
      sorter: (a: GoalT, b: GoalT) => a.lastName.localeCompare(b.lastName),
    },
    {
      key: "4",
      title: "Equipo",
      dataIndex: "teamName",
      sorter: (a: GoalT, b: GoalT) => a.teamName.localeCompare(b.teamName),
    },
    {
      key: "5",
      title: "Goles",
      dataIndex: "goals",
      sorter: (a: GoalT, b: GoalT) => a.goals - b.goals,
    },
    {
      key: "6",
      title: "Puntos",
      dataIndex: "points",
      sorter: (a: GoalT, b: GoalT) => a.points - b.points,
    },
  ];

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
