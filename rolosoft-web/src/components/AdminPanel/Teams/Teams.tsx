import React, { useEffect, useState } from "react";
import { Table, Button, message, Avatar, Modal } from "antd";
import { EyeOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import RegisterTeam from './RegisterTeam';
import EditTeam from './EditTeam';
import TeamDetailsModal from './TeamDetailsModal';
import { fetchRegisteredSchool } from '../../../services/schoolService';
import { School, Student } from '../../../types/types';

const Teams: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingSchool, setViewingSchool] = useState<School | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  const fetchSchools = async () => {
    const tournamentId = localStorage.getItem('selectedTournamentId');
    const token = localStorage.getItem('token');

    if (tournamentId && token) {
      try {
        const registeredSchools = await fetchRegisteredSchool(token, tournamentId);
        if (registeredSchools) {
          setSchools(registeredSchools);
        } else {
          message.error("Failed to load registered schools");
        }
      } catch (error) {
        message.error("Error fetching data");
      }
    } else {
      message.error('No tournament ID or token found');
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const onViewSchool = (record: School) => {
    setIsViewing(true);
    setViewingSchool(record);
  };

  const onEditSchool = (record: School) => {
    setIsEditing(true);
    setEditingSchool(record);
  };

  const onRegisterTeam = () => {
    setIsRegistering(true);
  };

  const columns = [
    {
      key: "1",
      title: "Nombre",
      dataIndex: "name",
      render: (_: any, record: School) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={record.shieldFileName ? `${process.env.REACT_APP_BASE_URL}/static/${record.shieldFileName}` : undefined}
            icon={!record.shieldFileName ? <UserOutlined /> : undefined}
          />
          <span style={{ marginLeft: 8 }}>{record.name}</span>
        </div>
      ),
      sorter: (a: School, b: School) => a.name.localeCompare(b.name),
    },
    {
      key: "2",
      title: "Sponsor",
      dataIndex: "sponsor",
      sorter: (a: School, b: School) => a.sponsor.localeCompare(b.sponsor),
    },
    {
      key: "3",
      title: "Acciones",
      render: (record: School) => (
        <>
          <EyeOutlined onClick={() => onViewSchool(record)} />
          <UserAddOutlined onClick={() => onEditSchool(record)} style={{ marginLeft: 12 }} />
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={onRegisterTeam}>Registrar Nuevo Equipo</Button>
      <div style={{ margin: "2%" }}></div>
      <Table columns={columns} dataSource={schools} rowKey="id" />
      <TeamDetailsModal
        visible={isViewing}
        onClose={() => setIsViewing(false)}
        school={viewingSchool}
      />
      <Modal
        title="Registrar Nuevo Equipo"
        open={isRegistering}
        footer={null}
        onCancel={() => setIsRegistering(false)}
      >
        <RegisterTeam onClose={() => {
          setIsRegistering(false);
          fetchSchools();
        }} />
      </Modal>
      {editingSchool && (
        <Modal
          title="Agregar Jugador"
          open={isEditing}
          footer={null}
          onCancel={() => setIsEditing(false)}
        >
          <EditTeam
            school={editingSchool}
            onClose={() => {
              setIsEditing(false);
              fetchSchools();
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default Teams;
