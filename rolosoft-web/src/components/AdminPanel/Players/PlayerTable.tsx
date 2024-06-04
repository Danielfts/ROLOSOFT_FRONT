import React, { useState } from 'react';
import { Table, Modal, message } from 'antd';
import { EyeOutlined, DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import { Student } from '../../../types/types';
import RegisterCard from './RegisterCard';

type PlayerTableProps = {
  dataSource: Student[];
  onViewPlayer: (player: Student) => void;
  onDeletePlayer: (player: Student) => void;
};

const PlayerTable: React.FC<PlayerTableProps> = ({ dataSource, onViewPlayer, onDeletePlayer }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const showModal = (student: Student) => {
    setSelectedStudent(student);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedStudent(null);
  };

  const columns = [
    { key: "1", title: "Nombres", dataIndex: "firstName", sorter: (a: Student, b: Student) => a.firstName.localeCompare(b.firstName) },
    { key: "2", title: "Apellidos", dataIndex: "lastName", sorter: (a: Student, b: Student) => a.lastName.localeCompare(b.lastName) },
    { key: "3", title: "Email", dataIndex: "email", sorter: (a: Student, b: Student) => a.email.localeCompare(b.email) },
    { key: "4", title: "Género", dataIndex: "gender", sorter: (a: Student, b: Student) => a.gender.localeCompare(b.gender) },
    { key: "5", title: "CURP", dataIndex: "CURP", sorter: (a: Student, b: Student) => a.CURP.localeCompare(b.CURP) },
    {
      key: "6",
      title: "Puntos",
      dataIndex: "points",
      render: (_: any, record: Student) => record.cards?.length || 0,
    },
    {
      key: "7",
      title: "Acciones",
      render: (record: Student) => (
        <>
          <EyeOutlined onClick={() => onViewPlayer(record)} />
          <DeleteOutlined onClick={() => onDeletePlayer(record)} style={{ color: "red", marginLeft: 12 }} />
          <FileAddOutlined onClick={() => showModal(record)} style={{ color: "green", marginLeft: 12 }} />
        </>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={dataSource} rowKey="CURP" />
      {selectedStudent && (
        <RegisterCard
          visible={isModalVisible}
          onCancel={handleCancel}
          student={selectedStudent}
        />
      )}
    </>
  );
};

export default PlayerTable;
