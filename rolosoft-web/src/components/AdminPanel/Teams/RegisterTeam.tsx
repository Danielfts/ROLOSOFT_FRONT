import React, { useState, useEffect } from 'react';
import { Form, Select, Button, message, Input } from 'antd';
import axios from 'axios';
import { DownOutlined } from '@ant-design/icons';

type School = {
  id: string;
  name: string;
};

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  CURP: string;
};

type RegisterTeamProps = {
  onClose: () => void;
};

const MAX_COUNT = 11;

const RegisterTeam: React.FC<RegisterTeamProps> = ({ onClose }) => {
  const [form] = Form.useForm();
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  useEffect(() => {
    fetchSchools();
    fetchStudents();
  }, []);

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

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const tournamentId = localStorage.getItem('selectedTournamentId');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/players?registered=false`, { headers });
      if (response.status === 200 && Array.isArray(response.data.data)) {
        setStudents(response.data.data);
      } else {
        message.error('Failed to fetch students');
      }
    } catch (error) {
      message.error('Error fetching students');
    }
  };

  const handleStudentSelect = (selectedItems: any) => {
    const newSelectedStudents = selectedItems.map((item: any) => {
      return students.find(s => s.id === item.value);
    }).filter(Boolean) as Student[];
    setSelectedStudents(newSelectedStudents);
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
        form.resetFields();
        setSelectedSchool(null);
        setSelectedStudents([]);
        await fetchStudents(); 
        await fetchSchools();
      } else {
        message.error('Failed to register team');
      }
    } catch (error) {
      message.error('Error registering team');
    }
  };

  const suffix = (
    <>
      <span>
        {selectedStudents.length} / {MAX_COUNT}
      </span>
      <DownOutlined />
    </>
  );

  const filteredStudents = students.filter(student => !selectedStudents.some(s => s.id === student.id));

  return (
    <div>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="school" rules={[{ required: true, message: 'Seleccione una Escuela' }]}>
          <Select
            placeholder="Seleccione una Escuela"
            onChange={(schoolId) => setSelectedSchool(schoolId as string)}
          >
            {schools.map(school => (
              <Select.Option key={school.id} value={school.id}>
                {school.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="sponsor" rules={[{ required: true, message: 'Ingrese el nombre del Sponsor' }]}>
          <Input placeholder="Sponsor Name" />
        </Form.Item>

        <Form.Item name="students" rules={[{ required: true, message: 'Seleccione 11 jugadores' }]}>
          <Select
            placeholder="Seleccione jugadores"
            onChange={handleStudentSelect}
            mode="multiple"
            maxTagCount={MAX_COUNT}
            value={selectedStudents.map(s => ({
              key: s.id,
              label: `${s.firstName} ${s.lastName} - ${s.email} - ${s.CURP}`,
              value: s.id
            }))}
            labelInValue
            suffixIcon={suffix}
          >
            {filteredStudents.map(student => (
              <Select.Option key={student.id} value={student.id}>
                {`${student.firstName} ${student.lastName} - ${student.email} - ${student.CURP}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

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
