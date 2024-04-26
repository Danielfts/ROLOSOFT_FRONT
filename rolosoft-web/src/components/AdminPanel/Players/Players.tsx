import { Button, Table, Modal, Input } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// Define a type for student data
type Student = {
  id: number;
  name: string;
  email: string;
  address: string;
};

function Players() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [dataSource, setDataSource] = useState<Student[]>([
    {
      id: 1,
      name: "John",
      email: "john@gmail.com",
      address: "John Address",
    },
    {
      id: 2,
      name: "David",
      email: "david@gmail.com",
      address: "David Address",
    },
    {
      id: 3,
      name: "James",
      email: "james@gmail.com",
      address: "James Address",
    },
    {
      id: 4,
      name: "Sam",
      email: "sam@gmail.com",
      address: "Sam Address",
    },
  ]);

  // Define the column structure with appropriate types
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
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "4",
      title: "Address",
      dataIndex: "address",
    },
    {
      key: "5",
      title: "Actions",
      render: (record: Student) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditStudent(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteStudent(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onAddStudent = () => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const newStudent: Student = {
      id: randomNumber,
      name: "Name " + randomNumber,
      email: randomNumber + "@gmail.com",
      address: "Address " + randomNumber,
    };
    setDataSource((prev) => [...prev, newStudent]);
  };

  const onDeleteStudent = (record: Student) => {
    Modal.confirm({
      title: "Are you sure you want to delete this student record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((prev) => prev.filter((student) => student.id !== record.id));
      },
    });
  };

  const onEditStudent = (record: Student) => {
    setIsEditing(true);
    setEditingStudent({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingStudent(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={onAddStudent}>Add a new Student</Button>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          title="Edit Student"
          visible={isEditing}
          okText="Save"
          onCancel={resetEditing}
          onOk={() => {
            setDataSource((prev) => prev.map((student) => (student.id === editingStudent?.id ? editingStudent : student)));
            resetEditing();
          }}
        >
          <Input
            value={editingStudent?.name}
            onChange={(e) =>
              setEditingStudent((prev) => (prev ? { ...prev, name: e.target.value } : null))
            }
          />
          <Input
            value={editingStudent?.email}
            onChange={(e) =>
              setEditingStudent((prev) => (prev ? { ...prev, email: e.target.value } : null))
            }
          />
          <Input
            value={editingStudent?.address}
            onChange={(e) =>
              setEditingStudent((prev) => (prev ? { ...prev, address: e.target.value } : null))
            }
          />
        </Modal>
      </header>
    </div>
  );
}

export default Players;
