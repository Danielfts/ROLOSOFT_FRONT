import { Button, Table, Modal, Input } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// Define a type for team data
type Team = {
  id: number;
  name: string;
  address: string;
};

function Teams() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [dataSource, setDataSource] = useState<Team[]>([
    {
      id: 1,
      name: "Team Alpha",
      address: "1234 Alpha St",
    },
    {
      id: 2,
      name: "Team Beta",
      address: "5678 Beta Ave",
    },
  ]);

  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
      sorter: (a: Team, b: Team) => a.id - b.id,
    },
    {
      key: "2",
      title: "Team",
      dataIndex: "name",
      sorter: (a: Team, b: Team) => a.name.localeCompare(b.name),
    },
    {
      key: "3",
      title: "Address",
      dataIndex: "address",
    },
    {
      key: "4",
      title: "Actions",
      render: (record: Team) => (
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
    const randomNumber = Math.floor(Math.random() * 1000);
    const newTeam: Team = {
      id: randomNumber,
      name: "Team " + randomNumber,
      address: "New Address " + randomNumber,
    };
    setDataSource((prev) => [...prev, newTeam]);
  };

  const onDeleteTeam = (record: Team) => {
    Modal.confirm({
      title: "Are you sure you want to delete this team?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((prev) => prev.filter((team) => team.id !== record.id));
      },
    });
  };

  const onEditTeam = (record: Team) => {
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
        <Button onClick={onAddTeam}>Add New Team</Button>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          title="Edit Team"
          visible={isEditing}
          okText="Save"
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
          <Input
            placeholder="Team Name"
            value={editingTeam?.name}
            onChange={(e) =>
              setEditingTeam((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
          />
          <Input
            placeholder="Address"
            value={editingTeam?.address}
            onChange={(e) =>
              setEditingTeam((prev) =>
                prev ? { ...prev, address: e.target.value } : null
              )
            }
          />
        </Modal>
      </header>
    </div>
  );
}

export default Teams;
