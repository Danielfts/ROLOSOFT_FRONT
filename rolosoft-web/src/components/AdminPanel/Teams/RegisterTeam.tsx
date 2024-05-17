import React, { useState, useEffect } from 'react';
import { Form, Select, Button, message, Input } from 'antd';
import axios from 'axios';

type School = {
  id: string;
  name: string;
};

type Student = {
  id: string;
  name: string;
};

type RegisterTeamProps = {
  onClose: () => void;
};

const RegisterTeam: React.FC<RegisterTeamProps> = ({ onClose }) => {
  const [form] = Form.useForm();
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [sponsor, setSponsor] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: token };
      const tournamentId = localStorage.getItem('selectedTournamentId');
      if (!tournamentId) {
        message.error('No tournament ID found');
        return;
      }
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools?registered=false`, { headers });
        if (response.status === 200 && response.data.success && Array.isArray(response.data.data)) {
          setSchools(response.data.data);
        } else {
          message.error('Failed to fetch schools');
        }
      } catch (error) {
        message.error('Error fetching schools');
      }
    };

    fetchSchools();
  }, []);

  const fetchStudents = async (schoolId: string) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/schools/${schoolId}/students`, { headers });
      if (response.status === 200 && Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        message.error('Failed to fetch students');
      }
    } catch (error) {
      message.error('Error fetching students');
    }
  };

  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student && !selectedStudents.some(s => s.id === studentId)) {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleStudentRemove = (studentId: string) => {
    setSelectedStudents(selectedStudents.filter(s => s.id !== studentId));
  };

  const handleSubmit = async (values: any) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const tournamentId = localStorage.getItem('selectedTournamentId');
    const payload = {
      school: {
        id: selectedSchool,
      },
      sponsor: values.sponsor,
      students: selectedStudents.map(s => s.id),
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools`, payload, { headers });
      if (response.status === 201) {
        message.success('Equipo registrado exitosamente!');
        onClose();
        // Reset the form
        form.resetFields();
        setSelectedSchool(null);
        setSelectedStudents([]);
      } else {
        message.error('Failed to register team');
      }
    } catch (error) {
      message.error('Error registering team');
    }
  };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="school" rules={[{ required: true, message: 'Seleccione una Escuela' }]}>
          <Select
            placeholder="Seleccione una Escuela"
            onChange={(schoolId) => {
              setSelectedSchool(schoolId as string);
              fetchStudents(schoolId as string);
            }}
          >
            {schools.map(school => (
              <Select.Option key={school.id} value={school.id}>
                {school.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="students" rules={[{ required: true, message: 'Seleccione al menos un Jugador' }]}>
          <Select
            placeholder="Seleccione un Jugador"
            onChange={(studentId) => handleStudentSelect(studentId as string)}
            mode="multiple"
          >
            {students.map(student => (
              <Select.Option key={student.id} value={student.id}>
                {student.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <div>
          <h4>Jugadores Seleccionados:</h4>
          {selectedStudents.map(student => (
            <div key={student.id}>
              {student.name} <Button onClick={() => handleStudentRemove(student.id)}>Remove</Button>
            </div>
          ))}
        </div>
        <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
          <Button type="primary" htmlType="submit">
            Registrar Equipo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterTeam;
