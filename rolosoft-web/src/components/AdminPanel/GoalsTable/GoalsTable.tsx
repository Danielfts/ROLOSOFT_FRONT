import React, { useState, useEffect } from 'react';
import { Table, Avatar, Modal, message, InputNumber } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { GoalT } from '../../../types/types';
import { fetchGoalTable } from '../../../services/statisticTableService';

const GoalsTable: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingPlayer, setEditingPlayer] = useState<GoalT | null>(null);
  const [dataSource, setDataSource] = useState<GoalT[]>([]);

  const fetchGoals = async () => {
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

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleEdit = (record: GoalT) => {
    setIsEditing(true);
    setEditingPlayer(record);
  };

  const handleDelete = (record: GoalT) => {
    Modal.confirm({
      title: "¿Estás seguro de que quieres eliminar a este jugador?",
      okText: "Sí",
      okType: "danger",
      onOk: () => {
        setDataSource((prev) => prev.filter((player) => player.studentId !== record.studentId));
        message.success("Jugador eliminado exitosamente!");
      },
    });
  };

  const handleSave = () => {
    setDataSource((prev) =>
      prev.map((player) => (player.studentId === editingPlayer?.studentId ? editingPlayer : player))
    );
    setIsEditing(false);
    setEditingPlayer(null);
    message.success("Goles actualizados exitosamente!");
  };

  const columns = [
    {
      key: "1",
      title: "Posición",
      dataIndex: "position",
      sorter: (a: GoalT, b: GoalT) => a.position - b.position,
    },
    {
      key: "2",
      title: "Nombre",
      dataIndex: "firstName",
      render: (_: any, record: GoalT) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={record.photoFileName ? `${process.env.REACT_APP_BASE_URL}/static/${record.photoFileName}` : undefined} 
            icon={!record.photoFileName ? <UserOutlined /> : undefined} 
          />
          <span style={{ marginLeft: 8 }}>{record.firstName}</span>
        </div>
      ),
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
      render: (_: any, record: GoalT) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={record.shieldFileName ? `${process.env.REACT_APP_BASE_URL}/static/${record.shieldFileName}` : undefined} 
            icon={!record.shieldFileName ? <UserOutlined /> : undefined} 
          />
          <span style={{ marginLeft: 8 }}>{record.teamName}</span>
        </div>
      ),
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
      title: "Tarjetas Verdes",
      dataIndex: "points",
      sorter: (a: GoalT, b: GoalT) => a.points - b.points,
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={dataSource} rowKey="studentId" />
      <Modal
        title="Editar Goles del Jugador"
        visible={isEditing}
        okText="Guardar"
        onCancel={() => {
          setIsEditing(false);
          setEditingPlayer(null);
        }}
        onOk={handleSave}
      >
        {editingPlayer && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <Avatar 
                size={64}
                src={editingPlayer.photoFileName ? `${process.env.REACT_APP_BASE_URL}/static/${editingPlayer.photoFileName}` : undefined} 
                icon={!editingPlayer.photoFileName ? <UserOutlined /> : undefined} 
              />
              <div style={{ marginLeft: 16 }}>
                <h3>{`${editingPlayer.firstName} ${editingPlayer.lastName}`}</h3>
                <p>{editingPlayer.teamName}</p>
              </div>
            </div>
            <InputNumber
              min={0}
              style={{ marginBottom: 16 }}
              value={editingPlayer.goals}
              onChange={(goals) =>
                setEditingPlayer((prev) =>
                  prev ? { ...prev, goals: goals || 0 } : null
                )
              }
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default GoalsTable;
