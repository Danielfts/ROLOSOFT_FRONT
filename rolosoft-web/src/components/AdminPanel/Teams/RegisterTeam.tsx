import { Modal, Select, Button, message, Input } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";

type School = {
  id: string;
  name: string;
};

type Student = {
  id: string;
  name: string;
};

type RegisterTeamProps = {
  visible: boolean;
  onClose: () => void;
};

const RegisterTeam: React.FC<RegisterTeamProps> = ({ visible, onClose }) => {
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

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const tournamentId = localStorage.getItem('selectedTournamentId');
    const payload = {
      school: {
        id: selectedSchool,
      },
      sponsor,
      students: selectedStudents.map(s => s.id),
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools`, payload, { headers });
      if (response.status === 201) {
        message.success('Team registered successfully!');
        onClose();
        // Reset the form
        setSelectedSchool(null);
        setSelectedStudents([]);
        setSponsor("");
      } else {
        message.error('Failed to register team');
      }
    } catch (error) {
      message.error('Error registering team');
    }
  };

  return (
    <Modal
      title="Register New Team"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width='80%'
    >
      <Select
        placeholder="Select a School"
        onChange={(schoolId) => {
          setSelectedSchool(schoolId as string);
          fetchStudents(schoolId as string);
        }}
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        {schools.map(school => (
          <Select.Option key={school.id} value={school.id}>
            {school.name}
          </Select.Option>
        ))}
      </Select>

      <Select
        placeholder="Select Students"
        onChange={(studentId) => handleStudentSelect(studentId as string)}
        style={{ width: '100%', marginBottom: '1rem' }}
        mode="multiple"
      >
        {students.map(student => (
          <Select.Option key={student.id} value={student.id}>
            {student.name}
          </Select.Option>
        ))}
      </Select>

      <div>
        <h4>Selected Students:</h4>
        {selectedStudents.map(student => (
          <div key={student.id}>
            {student.name} <Button onClick={() => handleStudentRemove(student.id)}>Remove</Button>
          </div>
        ))}
      </div>

      <Input
        placeholder="Sponsor Name"
        value={sponsor}
        onChange={(e) => setSponsor(e.target.value)}
        style={{ width: '100%', marginTop: '1rem' }}
      />

      <Button type="primary" onClick={handleSubmit} style={{ marginTop: '1rem' }}>
        Register Team
      </Button>
    </Modal>
  );
};

export default RegisterTeam;
