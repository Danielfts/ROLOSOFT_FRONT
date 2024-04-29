import { Button, Table, Modal, Input, DatePicker } from "antd";
import { useState } from "react";
import moment from "moment";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

type Match = {
  id: number;
  team1: string;
  team2: string;
  matchDate: moment.Moment;
};

function Matches() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [dataSource, setDataSource] = useState<Match[]>([
    {
      id: 1,
      team1: "FC Barcelona",
      team2: "Real Madrid",
      matchDate: moment().add(1, 'days'),
    },
    {
      id: 2,
      team1: "Manchester United",
      team2: "Liverpool FC",
      matchDate: moment().add(2, 'days'),
    },
  ]);

  const columns = [
    {
      key: "1",
      title: "Equipo 1",
      dataIndex: "team1",
      sorter: (a: Match, b: Match) => a.team1.localeCompare(b.team1),
    },
    {
      key: "2",
      title: "Equipo 2",
      dataIndex: "team2",
      sorter: (a: Match, b: Match) => a.team2.localeCompare(b.team2),
    },
    {
      key: "3",
      title: "Fecha del partido",
      dataIndex: "matchDate",
      render: (matchDate: moment.Moment) => matchDate.format("YYYY-MM-DD"),
      sorter: (a: Match, b: Match) => a.matchDate.valueOf() - b.matchDate.valueOf(),
    },
    {
      key: "4",
      title: "Actions",
      render: (record: Match) => (
        <>
          <EditOutlined
            onClick={() => {
              onEditMatch(record);
            }}
          />
          <DeleteOutlined
            onClick={() => {
              onDeleteMatch(record);
            }}
            style={{ color: "red", marginLeft: 12 }}
          />
        </>
      ),
    },
  ];

  const onAddMatch = () => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const newMatch: Match = {
      id: randomNumber,
      team1: "Team " + randomNumber,
      team2: "Team " + (randomNumber + 1),
      matchDate: moment().add(3, 'days'),
    };
    setDataSource((prev) => [...prev, newMatch]);
  };

  const onDeleteMatch = (record: Match) => {
    Modal.confirm({
      title: "¿Estás seguro de que quieres eliminar este partido?",
      okText: "Sí",
      okType: "danger",
      onOk: () => {
        setDataSource((prev) => prev.filter((match) => match.id !== record.id));
      },
    });
  };

  const onEditMatch = (record: Match) => {
    setIsEditing(true);
    setEditingMatch({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingMatch(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={onAddMatch}>Agregar Nuevo Partido</Button>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          title="Editar Partido"
          visible={isEditing}
          okText="Guardar"
          onCancel={resetEditing}
          onOk={() => {
            setDataSource((prev) =>
              prev.map((match) =>
                match.id === editingMatch?.id ? editingMatch : match
              )
            );
            resetEditing();
          }}
        >
          <Input
            placeholder="Equipo 1"
            value={editingMatch?.team1}
            onChange={(e) =>
              setEditingMatch((prev) =>
                prev ? { ...prev, team1: e.target.value } : null
              )
            }
          />
          <Input
            placeholder="Equipo 2"
            value={editingMatch?.team2}
            onChange={(e) =>
              setEditingMatch((prev) =>
                prev ? { ...prev, team2: e.target.value } : null
              )
            }
          />
          <DatePicker
            value={editingMatch?.matchDate}
            onChange={(date) =>
              setEditingMatch((prev) =>
                prev ? { ...prev, matchDate: date } : null
              )
            }
          />
        </Modal>
      </header>
    </div>
  );
}

export default Matches;
