import { Button, Table, Modal, message } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import RegisterUser from './RegisterUser';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  role: string;
  CURP: string;
};

function Users() {

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dataSource, setDataSource] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    try {
      if (!token) {
        message.error('No token found, please login.');
        return;
      }
      const response = await axios.get(process.env.REACT_APP_USERS_API_URL!, { headers });

      if (response.status === 200 && response.data.success) {
        setDataSource(response.data.data);

      } else {
        console.error('Failed to fetch users with status:', response.status);
        message.error('Error fetching users with unexpected status.');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('Error fetching users');
    }
  };


  const columns = [
    { key: "1", title: "ID", dataIndex: "id" },
    { key: "2", title: "First Name", dataIndex: "firstName" },
    { key: "3", title: "Last Name", dataIndex: "lastName" },
    { key: "4", title: "Email", dataIndex: "email" },
    { key: "5", title: "Phone", dataIndex: "phone" },
    { key: "6", title: "Birth Date", dataIndex: "birthDate" },
    { key: "7", title: "Gender", dataIndex: "gender" },
    { key: "8", title: "Role", dataIndex: "role" },
    { key: "9", title: "CURP", dataIndex: "CURP" },
    {
      key: "10",
      title: "Actions",
      render: (record: User) => (
        <>
          <EditOutlined onClick={() => onEditUser(record)} />
          <DeleteOutlined
            onClick={() => onDeleteUser(record)}
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
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            message.error('No token found, please login.');
            return;
          }
          const headers = { Authorization: token }
          const response = await axios.delete(`${process.env.REACT_APP_USERS_API_URL}/${record.id}`, { headers });

          if (response.status === 200) {
            setDataSource((prev) => prev.filter((user) => user.id !== record.id));
            message.success("User deleted successfully!");
          } else {
            message.error('Failed to delete user');
          }
        } catch (error) {
          message.error('Failed to delete user: ' + error);
        }
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
          open={isEditing}
          okText="Save"
          onCancel={resetEditing}
          onOk={resetEditing}
        >
        </Modal>
        <Modal
          title="Register New User"
          open={isRegistering}
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
