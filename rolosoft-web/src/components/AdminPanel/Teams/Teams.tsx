import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message, Descriptions, List, Avatar } from "antd";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import RegisterTeam from './RegisterTeam';
import EditTeam from './EditTeam';
import { fetchRegisteredSchool, deleteSchool } from '../../../services/schoolService';
import { School } from '../../../types/types';

const Teams: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingSchool, setViewingSchool] = useState<School | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  const onDeleteSchool = (record: School) => {
    Modal.confirm({
      title: "Are you sure you want to delete this school?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            await deleteSchool(token, record.id);
            setSchools((prev) => prev.filter((school) => school.id !== record.id));
            message.success("School deleted successfully!");
          } catch (error) {
            message.error('Failed to delete school');
          }
        } else {
          message.error('Authorization token is missing');
        }
      },
    });
  };

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
          <EditOutlined onClick={() => onEditSchool(record)} style={{ marginLeft: 12 }} />
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={onRegisterTeam}>Registrar Nuevo Equipo</Button>
      <div style={{ margin: "2%" }}></div>
      <Table columns={columns} dataSource={schools} rowKey="id" />
      <Modal
        title="Detalles de la Escuela"
        open={isViewing}
        onCancel={() => setIsViewing(false)}
        footer={null}
        width={700}
      >
        {viewingSchool && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Nombre">{viewingSchool.name}</Descriptions.Item>
            <Descriptions.Item label="Sponsor">{viewingSchool.sponsor}</Descriptions.Item>
            <Descriptions.Item label="Calle">{viewingSchool.address.address1}</Descriptions.Item>
            <Descriptions.Item label="Ciudad">{viewingSchool.address.city}</Descriptions.Item>
            <Descriptions.Item label="Estado">{viewingSchool.address.state}</Descriptions.Item>
            <Descriptions.Item label="Codigo Postal">{viewingSchool.address.postalCode}</Descriptions.Item>
            <Descriptions.Item label="Pais">{viewingSchool.address.country}</Descriptions.Item>
            <Descriptions.Item label="Jugadores">
              <List
                dataSource={viewingSchool.students}
                renderItem={(student) => (
                  <List.Item key={student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <List.Item.Meta
                      avatar={<Avatar src="https://via.placeholder.com/40" />}
                      title={`${student.firstName} ${student.lastName}`}
                      description={
                        <>
                          <div>CURP: {student.CURP}</div>
                          <div>Email: {student.email}</div>
                          <div>Posición: {student.student.fieldPosition}</div>
                          <div>Numero Camiseta: {student.student.shirtNumber}</div>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      <Modal
        title="Registrar Nuevo Equipo"
        open={isRegistering}
        footer={null}
        onCancel={() => setIsRegistering(false)}
        width={600}
      >
        <RegisterTeam onClose={() => {
          setIsRegistering(false);
          const fetchData = async () => {
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
          fetchData();
        }} />
      </Modal>
      <Modal
        title="Editar Equipo"
        open={isEditing}
        footer={null}
        onCancel={() => setIsEditing(false)}
        width={800}
      >
        <EditTeam
          school={editingSchool}
          onClose={() => {
            setIsEditing(false);
            const fetchData = async () => {
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
            fetchData();
          }}
        />
      </Modal>
    </div>
  );
};

export default Teams;
