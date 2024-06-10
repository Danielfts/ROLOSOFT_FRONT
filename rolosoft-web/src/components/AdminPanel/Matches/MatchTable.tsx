import React from 'react';
import { Table, Avatar } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { FaFutbol } from 'react-icons/fa';
import { Match } from '../../../types/types';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';

interface MatchTableProps {
  matches: Match[];
  onViewMatch: (match: Match) => void;
  onRegisterGoal: (match: Match) => void;
}

const MatchTable: React.FC<MatchTableProps> = ({ matches, onViewMatch, onRegisterGoal }) => {
  const matchColumns = [
    {
      key: "1",
      title: "Equipo A",
      dataIndex: ["teamA", "name"],
      render: (_: any, record: Match) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={record.teamA.shieldFileName ? `${process.env.REACT_APP_BASE_URL}/static/${record.teamA.shieldFileName}` : undefined}
            icon={!record.teamA.shieldFileName ? <UserOutlined /> : undefined}
          />
          <span style={{ marginLeft: 8 }}>{record.teamA.name}</span>
        </div>
      ),
      sorter: (a: Match, b: Match) => a.teamA.name.localeCompare(b.teamA.name),
    },
    {
      key: "2",
      title: "Total Goles Equipo A",
      render: (record: Match) => record.teamA.goals.length,
    },
    {
      key: "3",
      title: "Equipo B",
      dataIndex: ["teamB", "name"],
      render: (_: any, record: Match) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={record.teamB.shieldFileName ? `${process.env.REACT_APP_BASE_URL}/static/${record.teamB.shieldFileName}` : undefined}
            icon={!record.teamB.shieldFileName ? <UserOutlined /> : undefined}
          />
          <span style={{ marginLeft: 8 }}>{record.teamB.name}</span>
        </div>
      ),
      sorter: (a: Match, b: Match) => b.teamB.name.localeCompare(a.teamB.name),
    },
    {
      key: "4",
      title: "Total Goles Equipo B",
      render: (record: Match) => record.teamB.goals.length,
    },
    {
      key: "5",
      title: "Fecha Inicio",
      dataIndex: "dateTimeStart",
      render: (dateTimeStart: string) => moment(dateTimeStart).format('DD/MM/YYYY HH:mm'),
      sorter: (a: Match, b: Match) => new Date(a.dateTimeStart).getTime() - new Date(b.dateTimeStart).getTime(),
    },
    {
      key: "6",
      title: "Fecha Fin",
      dataIndex: "dateTimeEnd",
      render: (dateTimeEnd: string) => moment(dateTimeEnd).format('DD/MM/YYYY HH:mm'),
      sorter: (a: Match, b: Match) => new Date(a.dateTimeEnd).getTime() - new Date(b.dateTimeEnd).getTime(),
    },
    {
      key: "7",
      title: "Acciones",
      render: (record: Match) => (
        <>
          <span onClick={() => onRegisterGoal(record)} style={{ marginRight: 12 }}>
            <FaFutbol />
          </span>
          <EyeOutlined onClick={() => onViewMatch(record)} style={{ marginRight: 12 }} />
        </>
      ),
    },
  ];

  return <Table columns={matchColumns} dataSource={matches} rowKey="id" />;
};

export default MatchTable;
