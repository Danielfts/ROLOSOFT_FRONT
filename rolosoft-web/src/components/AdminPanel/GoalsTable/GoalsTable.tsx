import { Button, Table, Modal, Input, InputNumber } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// Define a type for player statistics
type Player = {
  id: number;
  name: string;
  goals: number;
  points: number;
};

function GoalsTable() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [dataSource, setDataSource] = useState<Player[]>([
    {
      id: 1,
      name: "Lionel Messi",
      goals: 30,
      points: 90,
    },
    {
      id: 2,
      name: "Cristiano Ronaldo",
      goals: 28,
      points: 84,
    },
  ]);

  const columns = [
    {
      key: "1",
      title: "Jugador",
      dataIndex: "name",
      sorter: (a: Player, b: Player) => a.name.localeCompare(b.name),
    },
    {
      key: "2",
      title: "Goles",
      dataIndex: "goals",
      sorter: (a: Player, b: Player) => a.goals - b.goals,
    },
    {
      key: "3",
      title: "Puntos",
      dataIndex: "points",
      sorter: (a: Player, b: Player) => a.points - b.points,
    },
    {
      key: "4",
      title: "Acciones",
      render: (record: Player) => (
        <>
          <EditOutlined
            onClick={() => {
              onEditPlayer(record);
            }}
          />
          <DeleteOutlined
            onClick={() => {
              onDeletePlayer(record);
            }}
            style={{ color: "red", marginLeft: 12 }}
          />
        </>
      ),
    },
  ];

  const onAddPlayer = () => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const newPlayer: Player = {
      id: randomNumber,
      name: "New Player " + randomNumber,
      goals: Math.floor(Math.random() * 50), // Random goals up to 50
      points: Math.floor(Math.random() * 150), // Random points up to 150
    };
    setDataSource((prev) => [...prev, newPlayer]);
  };

  const onDeletePlayer = (record: Player) => {
    Modal.confirm({
      title: "¿Estás seguro de que quieres eliminar este jugador?",
      okText: "Sí",
      okType: "danger",
      onOk: () => {
        setDataSource((prev) => prev.filter((player) => player.id !== record.id));
      },
    });
  };

  const onEditPlayer = (record: Player) => {
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
        <Button type="primary" onClick={onAddPlayer}>Agregar Nuevo Jugador</Button>
        <div style={{ margin: "2%" }}></div>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          title="Editar Jugador"
          open={isEditing}
          okText="Guardar"
          onCancel={resetEditing}
          onOk={() => {
            setDataSource((prev) =>
              prev.map((player) =>
                player.id === editingPlayer?.id ? editingPlayer : player
              )
            );
            resetEditing();
          }}
        >
          <Input
            placeholder="Nombre del Jugador"
            value={editingPlayer?.name}
            onChange={(e) =>
              setEditingPlayer((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
          />
          <InputNumber
            min={0}
            max={100}
            defaultValue={0}
            value={editingPlayer?.goals}
            onChange={(goals) =>
              setEditingPlayer((prev) =>
                prev ? { ...prev, goals: goals || 0 } : null
              )
            }
          />
          <InputNumber
            min={0}
            max={300}
            defaultValue={0}
            value={editingPlayer?.points}
            onChange={(points) =>
              setEditingPlayer((prev) =>
                prev ? { ...prev, points: points || 0 } : null
              )
            }
          />
        </Modal>
      </header>
    </div>
  );
}

export default GoalsTable;
