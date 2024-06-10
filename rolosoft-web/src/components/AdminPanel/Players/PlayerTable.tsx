import React, { useState } from 'react';
import { Table, Avatar } from 'antd';
import { EyeOutlined, FileAddOutlined, PictureOutlined, UserOutlined } from '@ant-design/icons';
import { Student } from '../../../types/types';
import RegisterCard from './RegisterCard';
import EditPlayer from './EditPlayer';

type PlayerTableProps = {
  dataSource: Student[];
  onViewPlayer: (player: Student) => void;
  onEditPlayer: (updatedPlayer: Student) => void;
  onRefreshTable: () => void;
};

const PlayerTable: React.FC<PlayerTableProps> = ({ dataSource, onViewPlayer, onEditPlayer, onRefreshTable }) => {
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const showRegisterModal = (student: Student) => {
    setSelectedStudent(student);
    setIsRegisterModalVisible(true);
  };

  const showEditModal = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsRegisterModalVisible(false);
    setIsEditModalVisible(false);
    setSelectedStudent(null);
    onRefreshTable();
  };

  const handleEditSave = (updatedStudent: Student) => {
    onEditPlayer(updatedStudent);
    handleCancel();
  };

  const columns = [
    {
      key: "1",
      title: "Nombres",
      dataIndex: "firstName",
      render: (_: any, record: Student) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={record.student.photoFileName ? `${process.env.REACT_APP_BASE_URL}/static/${record.student.photoFileName}` : undefined} 
            icon={!record.student.photoFileName ? <UserOutlined /> : undefined} 
          />
          <span style={{ marginLeft: 8 }}>{record.firstName}</span>
        </div>
      ),
      sorter: (a: Student, b: Student) => a.firstName.localeCompare(b.firstName)
    },
    { key: "2", title: "Apellidos", dataIndex: "lastName", sorter: (a: Student, b: Student) => a.lastName.localeCompare(b.lastName) },
    { key: "3", title: "Email", dataIndex: "email", sorter: (a: Student, b: Student) => a.email.localeCompare(b.email) },
    { key: "4", title: "Género", dataIndex: "gender", sorter: (a: Student, b: Student) => a.gender.localeCompare(b.gender) },
    { key: "5", title: "CURP", dataIndex: "CURP", sorter: (a: Student, b: Student) => a.CURP.localeCompare(b.CURP) },
    {
      key: "6",
      title: "Tarjetas Verdes",
      dataIndex: "points",
      render: (_: any, record: Student) => record.student.greenCards?.length || 0,
    },
    {
      key: "7",
      title: "Acciones",
      render: (record: Student) => (
        <>
          <EyeOutlined onClick={() => onViewPlayer(record)} />
          <FileAddOutlined onClick={() => showRegisterModal(record)} style={{ color: "green", marginLeft: 12 }} />
          <PictureOutlined onClick={() => showEditModal(record)} style={{ marginLeft: 12 }} />
        </>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={dataSource} rowKey="CURP" />
      {selectedStudent && (
        <RegisterCard
          visible={isRegisterModalVisible}
          onCancel={() => setIsRegisterModalVisible(false)}
          student={selectedStudent}
        />
      )}
      {selectedStudent && (
        <EditPlayer
          visible={isEditModalVisible}
          onCancel={handleCancel}
          student={selectedStudent}
          onSave={handleEditSave}
        />
      )}
    </>
  );
};

export default PlayerTable;
