import React, { useState, useEffect } from 'react';
import { Form, Select, Button, message, Input } from 'antd';
import axios from 'axios';
import { DownOutlined } from '@ant-design/icons';
import { registerTeam } from '../../../services/teamService';
import { fetchUnregisteredSchool } from '../../../services/schoolService';

import { fetchUnregisteredStudent } from '../../../services/studentService';
import { School, Student } from '../../../types/types';

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
    fetchUnregisteredSchool().then(setSchools).catch(() => message.error('Failed to fetch schools'));
    fetchUnregisteredStudent().then(setStudents).catch(() => message.error('Failed to fetch students'));
  }, []);  

  const handleStudentSelect = (selectedItems: any) => {
    const newSelectedStudents = selectedItems.map((item: any) => {
      return students.find(s => s.id === item.value);
    }).filter(Boolean) as Student[];
    setSelectedStudents(newSelectedStudents);
  };

  const handleSubmit = async (values: any) => {
    try {
      await registerTeam(selectedSchool, values.sponsor, selectedStudents.map(s => s.id));
      message.success('Equipo registrado exitosamente!');
      onClose();
      form.resetFields();
      setSelectedSchool(null);
      setSelectedStudents([]);
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
          <Input placeholder="Nombre del Sponsor" />
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
