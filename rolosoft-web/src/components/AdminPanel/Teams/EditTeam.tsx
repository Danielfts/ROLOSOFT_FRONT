import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, message, List, Avatar, Descriptions } from 'antd';
import { addStudentToTeam } from '../../../services/teamService';
import { fetchUnregisteredStudent } from '../../../services/studentService';
import { School, Student } from '../../../types/types';

type EditTeamProps = {
  school: School | null;
  onClose: () => void;
};

const EditTeam: React.FC<EditTeamProps> = ({ school, onClose }) => {
  const [form] = Form.useForm();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const tournamentId = localStorage.getItem('selectedTournamentId');
      const token = localStorage.getItem('token');

      if (school && tournamentId && token) {
        try {
          const unregisteredStudents = await fetchUnregisteredStudent(token, tournamentId);
          if (unregisteredStudents) {
            setStudents(unregisteredStudents);
          } else {
            message.error("Failed to load unregistered students");
          }
        } catch (error) {
          message.error("Error fetching data");
        }
      } else {
        message.error('No tournament ID or token found');
      }
    };

    if (school) {
      fetchStudents();
    }
  }, [school]);

  useEffect(() => {
    form.resetFields();
    setSelectedPlayer(null);
  }, [school]);

  const handlePlayerSelect = (value: string) => {
    setSelectedPlayer(value);
  };

  const handleAddPlayer = async () => {
    if (!selectedPlayer || !school) {
      message.error('Por favor seleccione un jugador');
      return;
    }

    const tournamentId = localStorage.getItem('selectedTournamentId');
    const token = localStorage.getItem('token');
    if (tournamentId && token) {
      try {
        const success = await addStudentToTeam(token, tournamentId, school.id, selectedPlayer);
        if (success) {
          onClose();
        }
      } catch (error) {
        message.error('Error al agregar jugador');
      }
    } else {
      message.error('No tournament ID or token found');
    }
  };

  return (
    <div>
      {school && (
        <Form form={form} layout="vertical">
        <Form.Item name="player" rules={[{ required: true, message: 'Seleccione un jugador' }]}>
          <Select
            placeholder="Seleccione un jugador"
            onChange={handlePlayerSelect}
          >
            {students.map(student => (
              <Select.Option key={student.id} value={student.id}>
                {`${student.firstName} ${student.lastName} - ${student.email} - ${student.CURP}`}
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
      )}
    </div>
  );
};

export default EditTeam;
