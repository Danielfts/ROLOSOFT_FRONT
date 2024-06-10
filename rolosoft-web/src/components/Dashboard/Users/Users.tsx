import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, message, Upload, Tooltip, Divider } from 'antd';
import { InboxOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import RegisterUser from './RegisterUser';
import UserDetails from './UserDetails';
import { User } from '../../../types/types';
import { fetchUsers } from '../../../services/userService';

const { Dragger } = Upload;

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
    { key: "1", title: "Nombres", dataIndex: "firstName", sorter: (a: User, b: User) => a.firstName.localeCompare(b.firstName) },
    { key: "2", title: "Apellidos", dataIndex: "lastName", sorter: (a: User, b: User) => a.lastName.localeCompare(b.lastName) },
    { key: "3", title: "Email", dataIndex: "email", sorter: (a: User, b: User) => a.email.localeCompare(b.email) },
    { key: "4", title: "Teléfono", dataIndex: "phone", sorter: (a: User, b: User) => a.phone.localeCompare(b.phone) },
    { key: "5", title: "Fecha de nacimiento", dataIndex: "birthDate", sorter: (a: User, b: User) => a.birthDate.localeCompare(b.birthDate) },
    { key: "6", title: "Género", dataIndex: "gender", sorter: (a: User, b: User) => a.gender.localeCompare(b.gender) },
    { key: "7", title: "Rol", dataIndex: "role", sorter: (a: User, b: User) => a.role.localeCompare(b.role) },
    { key: "8", title: "CURP", dataIndex: "CURP", sorter: (a: User, b: User) => a.CURP.localeCompare(b.CURP) },
    {
      key: "9",
      title: "Acciones",
      render: (record: User) => (
        <>
          <Tooltip title="Ver detalles">
            <EyeOutlined onClick={() => onViewUser(record)} style={{ cursor: 'pointer', marginRight: 8 }} />
          </Tooltip>
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

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv',
    action: 'https://your-upload-api-endpoint.com/upload',
    onChange(info: any) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: (file: File) => {
      const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
      if (!isCSV) {
        message.error('You can only upload CSV files!');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onDrop(e: any) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <div className="App">
      <header className="App-header">
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag a CSV file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single CSV file upload only.</p>
        </Dragger>

        {/* Add a Divider or margin for separation */}
        <Divider>o</Divider>

        <Button type="primary" onClick={onAddUser} style={{ marginTop: '16px' }}>
          Registrar Nuevo Usuario
        </Button>

        <div style={{ margin: "2%" }}></div>
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
        <UserDetails
          visible={isViewing}
          onClose={() => setIsViewing(false)}
          user={viewingUser}
        />
        <Modal
          title="Registrar Nuevo Usuario"
          open={isRegistering}
          footer={null}
          onCancel={() => setIsRegistering(false)}
          width={500}
        >
          <RegisterUser />
        </Modal>
      </header>
    </div>
  );
};
export default Users;
