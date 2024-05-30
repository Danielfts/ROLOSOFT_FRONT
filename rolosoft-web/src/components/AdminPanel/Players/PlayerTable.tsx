import React from 'react';
import { Table, message, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Student } from '../../../types/types';

type PlayerTableProps = {
  dataSource: Student[];
  onViewPlayer: (player: Student) => void;
  onDeletePlayer: (player: Student) => void;
};

const PlayerTable: React.FC<PlayerTableProps> = ({ dataSource, onViewPlayer, onDeletePlayer }) => {
  const columns = [
    { key: "1", title: "Nombres", dataIndex: "firstName", sorter: (a: Student, b: Student) => a.firstName.localeCompare(b.firstName) },
    { key: "2", title: "Apellidos", dataIndex: "lastName", sorter: (a: Student, b: Student) => a.lastName.localeCompare(b.lastName) },
    { key: "3", title: "Email", dataIndex: "email", sorter: (a: Student, b: Student) => a.email.localeCompare(b.email) },
    { key: "4", title: "Género", dataIndex: "gender", sorter: (a: Student, b: Student) => a.gender.localeCompare(b.gender) },
    { key: "5", title: "CURP", dataIndex: "CURP", sorter: (a: Student, b: Student) => a.CURP.localeCompare(b.CURP) },
    {
      key: "6",
      title: "Acciones",
      render: (record: Student) => (
        <>
          <EyeOutlined onClick={() => onViewPlayer(record)} />
          <DeleteOutlined onClick={() => onDeletePlayer(record)} style={{ color: "red", marginLeft: 12 }} />
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={dataSource} rowKey="CURP" />;
};

export default PlayerTable;
