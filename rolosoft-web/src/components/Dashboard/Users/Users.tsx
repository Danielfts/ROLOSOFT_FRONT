import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, message } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import RegisterUser from './RegisterUser';
import UserDetails from './UserDetails';
import { User } from '../../../types/types';
import { fetchUsers, deleteUser } from '../../../services/userService';

const Users: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [dataSource, setDataSource] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const users = await fetchUsers(token);
          if (users) {
            setDataSource(users);
          } else {
            message.error("Failed to load users");
          }
        } catch (error) {
          message.error("Error fetching data");
        }
      } else {
        message.error('No token found');
      }
    };
    fetchUsersData();
  }, []);

  const columns = [
    { key: "2", title: "Nombres", dataIndex: "firstName", sorter: (a: User, b: User) => a.firstName.localeCompare(b.firstName) },
    { key: "3", title: "Apellidos", dataIndex: "lastName", sorter: (a: User, b: User) => a.lastName.localeCompare(b.lastName) },
    { key: "4", title: "Email", dataIndex: "email", sorter: (a: User, b: User) => a.email.localeCompare(b.email) },
    { key: "5", title: "Teléfono", dataIndex: "phone", sorter: (a: User, b: User) => a.phone.localeCompare(b.phone) },
    { key: "6", title: "Fecha de nacimiento", dataIndex: "birthDate", sorter: (a: User, b: User) => a.birthDate.localeCompare(b.birthDate) },
    { key: "7", title: "Género", dataIndex: "gender", sorter: (a: User, b: User) => a.gender.localeCompare(b.gender) },
    { key: "8", title: "Rol", dataIndex: "role", sorter: (a: User, b: User) => a.role.localeCompare(b.role) },
    { key: "9", title: "CURP", dataIndex: "CURP", sorter: (a: User, b: User) => a.CURP.localeCompare(b.CURP) },
    {
      key: "10",
      title: "Acciones",
      render: (record: User) => (
        <>
          <EyeOutlined onClick={() => onViewUser(record)} />
        </>
      ),
    },
  ];

  const onViewUser = (record: User) => {
    setIsViewing(true);
    setViewingUser(record);
  };

  const onAddUser = () => {
    setIsRegistering(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button type="primary" onClick={onAddUser}>Registrar Nuevo Usuario</Button>
        <div style={{ margin: "2%" }}></div>
        <Table columns={columns} dataSource={dataSource} />
        <UserDetails
          visible={isViewing}
          onClose={() => setIsViewing(false)}
          user={viewingUser}
        />
        <Modal
          title="Registrar Nuevo Usuario"
          open={isRegistering}
          footer={null}
          onCancel={() => {
            setIsRegistering(false);
            const fetchUsersData = async () => {
              const token = localStorage.getItem('token');

              if (token) {
                try {
                  const users = await fetchUsers(token);
                  if (users) {
                    setDataSource(users);
                  } else {
                    message.error("Failed to load users");
                  }
                } catch (error) {
                  message.error("Error fetching data");
                }
              } else {
                message.error('No token found');
              }
            };
            fetchUsersData();
          }}
          width={500}
        >
          <RegisterUser />
        </Modal>
      </header>
    </div>
  );
};

export default Users;
