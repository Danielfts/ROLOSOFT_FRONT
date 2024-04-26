import { Button, Table, Modal, Input } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// Define a type for user data
type User = {
  id: number;
  name: string;
  email: string;
  userType: string;
};

function Users() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dataSource, setDataSource] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      userType: "Admin",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@example.com",
      userType: "User",
    },
  ]);

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
      title: "User Type",
      dataIndex: "userType",
    },
    {
      key: "5",
      title: "Actions",
      render: (record: User) => (
        <>
          <EditOutlined
            onClick={() => {
              onEditUser(record);
            }}
          />
          <DeleteOutlined
            onClick={() => {
              onDeleteUser(record);
            }}
            style={{ color: "red", marginLeft: 12 }}
          />
        </>
      ),
    },
  ];

  const onAddUser = () => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const newUser: User = {
      id: randomNumber,
      name: "User " + randomNumber,
      email: randomNumber + "@example.com",
      userType: "User",
    };
    setDataSource((prev) => [...prev, newUser]);
  };

  const onDeleteUser = (record: User) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((prev) => prev.filter((user) => user.id !== record.id));
      },
    });
  };

  const onEditUser = (record: User) => {
    setIsEditing(true);
    setEditingUser({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingUser(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={onAddUser}>Add New User</Button>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          title="Edit User"
          visible={isEditing}
          okText="Save"
          onCancel={resetEditing}
          onOk={() => {
            setDataSource((prev) =>
              prev.map((user) =>
                user.id === editingUser?.id ? editingUser : user
              )
            );
            resetEditing();
          }}
        >
          <Input
            value={editingUser?.name}
            onChange={(e) =>
              setEditingUser((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
          />
          <Input
            value={editingUser?.email}
            onChange={(e) =>
              setEditingUser((prev) =>
                prev ? { ...prev, email: e.target.value } : null
              )
            }
          />
          <Input
            value={editingUser?.userType}
            onChange={(e) =>
              setEditingUser((prev) =>
                prev ? { ...prev, userType: e.target.value } : null
              )
            }
          />
        </Modal>
      </header>
    </div>
  );
}

export default Users;
