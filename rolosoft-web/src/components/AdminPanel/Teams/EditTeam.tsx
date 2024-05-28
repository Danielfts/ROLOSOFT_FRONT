import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, message, List, Avatar, Descriptions } from 'antd';
import axios from 'axios';

type Address = {
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type Student = {
  id: string;
  curp: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: string;
  role: string;
  phone: string;
  address: Address;
  student: {
    fieldPosition: string;
    shirtNumber: number;
    IMSS: string;
  };
};

type School = {
  id: string;
  name: string;
  address: Address;
  sponsor: string;
  students: Student[];
};

type EditTeamProps = {
  school: School | null;
  onClose: () => void;
};

const EditTeam: React.FC<EditTeamProps> = ({ school, onClose }) => {
  const [form] = Form.useForm();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  useEffect(() => {
    if (school) {
      fetchAvailablePlayers();
    }
  }, [school]);

  useEffect(() => {
    form.resetFields();
    setSelectedPlayer(null);
  }, [school]);

  const fetchAvailablePlayers = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const tournamentId = localStorage.getItem('selectedTournamentId');

    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/players?registered=false`, { headers });
      if (response.status === 200 && Array.isArray(response.data.data)) {
        setStudents(response.data.data);
      } else {
        message.error('Failed to fetch players');
      }
    } catch (error) {
      message.error('Error fetching players');
    }
  };

  const handlePlayerSelect = (value: string) => {
    setSelectedPlayer(value);
  };

  const handleAddPlayer = async () => {
    if (!selectedPlayer || !school) {
      message.error('Please select a player');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const tournamentId = localStorage.getItem('selectedTournamentId');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools/${school.id}/students/${selectedPlayer}`,
        {},
        { headers }
      );

      if (response.status === 201) {
        message.success('Player added successfully!');
        onClose();
      } else {
        message.error('Failed to add player');
      }
    } catch (error) {
      message.error('Error adding player');
    }
  };

  return (
    <div>
      {school && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Nombre">{school.name}</Descriptions.Item>
          <Descriptions.Item label="Sponsor">{school.sponsor}</Descriptions.Item>
          <Descriptions.Item label="Jugadores">
            <List
              dataSource={school.students}
              renderItem={(student: Student) => (
                <List.Item key={student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <List.Item.Meta
                    avatar={<Avatar src="https://via.placeholder.com/40" />}
                    title={`${student.firstName} ${student.lastName}`}
                    description={
                      <>
                        <div>CURP: {student.curp}</div>
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
          <Descriptions.Item label="Agregar Jugador">
            <Form form={form} layout="vertical">
              <Form.Item name="player" rules={[{ required: true, message: 'Seleccione un jugador' }]}>
                <Select
                  placeholder="Seleccione un jugador"
                  onChange={handlePlayerSelect}
                >
                  {students.map(student => (
                    <Select.Option key={student.id} value={student.id}>
                      {`${student.firstName} ${student.lastName} - ${student.email} - ${student.curp}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleAddPlayer}>
                  Añadir Jugador
                </Button>
              </Form.Item>
            </Form>
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  );
};

export default EditTeam;
