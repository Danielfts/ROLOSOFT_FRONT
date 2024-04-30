import { Button, Table, Modal, message } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import RegisterUser from './RegisterUser'; // Assuming the form is in the same directory

// Define a type for user data
type User = {
  id: number;
  name: string;
  email: string;
  address: string; // Add address field
  userType: string;
};

function Users() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dataSource, setDataSource] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      address: "123 Elm St",
      userType: "Admin",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@example.com",
      address: "456 Maple Ave",
      userType: "User",
    },
  ]);

  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
      sorter: (a: User, b: User) => a.id - b.id,
    },
    {
      key: "2",
      title: "Name",
      dataIndex: "name",
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
    },
    {
      key: "3",
      title: "Email",
      dataIndex: "email",
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      key: "4",
      title: "Address",
      dataIndex: "address",
      sorter: (a: User, b: User) => a.address.localeCompare(b.address),
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
    setIsRegistering(true);
  };

  const onDeleteUser = (record: User) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((prev) => prev.filter((user) => user.id !== record.id));
        message.success("User deleted successfully!");
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
          onOk={resetEditing}
        >
        </Modal>
        <Modal
          title="Register New User"
          visible={isRegistering}
          footer={null}
          onCancel={() => setIsRegistering(false)}
          width='80%'
        >
          <RegisterUser />
        </Modal>
      </header>
    </div>
  );
}

export default Users;
