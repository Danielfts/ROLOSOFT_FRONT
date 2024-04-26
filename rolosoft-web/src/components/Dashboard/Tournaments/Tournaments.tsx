import { Button, Table, Modal, Input, DatePicker } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import moment from "moment";

// Define a type for tournament data
type Tournament = {
  id: number;
  name: string;
  beginDate: moment.Moment;
  endDate: moment.Moment;
};

function Tournaments() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [dataSource, setDataSource] = useState<Tournament[]>([
    {
      id: 1,
      name: "Tournament A",
      beginDate: moment(),
      endDate: moment().add(10, 'days'),
    },
    {
      id: 2,
      name: "Tournament B",
      beginDate: moment(),
      endDate: moment().add(20, 'days'),
    },
  ]);

  const navigate = useNavigate();

  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "2",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "3",
      title: "Begin Date",
      dataIndex: "beginDate",
      render: (beginDate: moment.Moment) => beginDate.format("YYYY-MM-DD"),
    },
    {
      key: "4",
      title: "End Date",
      dataIndex: "endDate",
      render: (endDate: moment.Moment) => endDate.format("YYYY-MM-DD"),
    },
    {
      key: "5",
      title: "Actions",
      render: (record: Tournament) => (
        <>
          <EditOutlined
            onClick={() => {
              onEditTournament(record);
            }}
          />
          <DeleteOutlined
            onClick={() => {
              onDeleteTournament(record);
            }}
            style={{ color: "red", marginLeft: 12 }}
          />
          <SettingOutlined
            onClick={() => administrateTournament(record.id)}
            style={{ marginLeft: 12 }}
          />
        </>
      ),
    },
  ];

  const onAddTournament = () => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const newTournament: Tournament = {
      id: randomNumber,
      name: "Tournament " + randomNumber,
      beginDate: moment(),
      endDate: moment().add(30, 'days'),
    };
    setDataSource((prev) => [...prev, newTournament]);
  };

  const onDeleteTournament = (record: Tournament) => {
    Modal.confirm({
      title: "Are you sure you want to delete this tournament?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((prev) => prev.filter((tournament) => tournament.id !== record.id));
      },
    });
  };

  const onEditTournament = (record: Tournament) => {
    setIsEditing(true);
    setEditingTournament({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingTournament(null);
  };

  const administrateTournament = (id: number) => {
    navigate(`/adminPanel`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={onAddTournament}>Add New Tournament</Button>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          title="Edit Tournament"
          visible={isEditing}
          okText="Save"
          onCancel={resetEditing}
          onOk={() => {
            setDataSource((prev) =>
              prev.map((tournament) =>
                tournament.id === editingTournament?.id ? editingTournament : tournament
              )
            );
            resetEditing();
          }}
        >
          <Input
            value={editingTournament?.name}
            onChange={(e) =>
              setEditingTournament((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
          />
          <DatePicker
            value={editingTournament?.beginDate}
            onChange={(date) =>
              setEditingTournament((prev) =>
                prev ? { ...prev, beginDate: date } : null
              )
            }
          />
          <DatePicker
            value={editingTournament?.endDate}
            onChange={(date) =>
              setEditingTournament((prev) =>
                prev ? { ...prev, endDate: date } : null
              )
            }
          />
        </Modal>
      </header>
    </div>
  );
}

export default Tournaments;
