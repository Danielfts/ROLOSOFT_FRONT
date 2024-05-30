import React, { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { fetchRegisteredStudent, deleteStudent } from '../../../services/studentService';
import { Student } from '../../../types/types';
import PlayerDetailsModal from './PlayerDetailsModal';
import PlayerTable from './PlayerTable';

const Players: React.FC = () => {
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingPlayer, setViewingPlayer] = useState<Student | null>(null);
  const [dataSource, setDataSource] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const tournamentId = localStorage.getItem('selectedTournamentId');
      const token = localStorage.getItem('token');

      if (tournamentId && token) {
        try {
          const students = await fetchRegisteredStudent(token, tournamentId);
          if (students) {
            setDataSource(students);
          } else {
            message.error("Failed to load registered students");
          }
        } catch (error) {
          message.error("Error fetching data");
        }
      } else {
        message.error('No tournament ID or token found');
      }
    };
    fetchStudents();
  }, []);

  const onViewPlayer = (record: Student) => {
    setIsViewing(true);
    setViewingPlayer(record);
  };

  const onDeletePlayer = (record: Student) => {
    Modal.confirm({
      title: "¿Estás seguro de que deseas eliminar a este jugador?",
      okText: "Sí",
      okType: "danger",
      onOk: async () => {
        const token = localStorage.getItem('token');
        if (token) {
          const success = await deleteStudent(token, record.CURP);
          if (success) {
            setDataSource((prev) => prev.filter((player) => player.CURP !== record.CURP));
          }
        } else {
          message.error('Authorization token is missing');
        }
      },
    });
  };

  return (
    <div>
      <PlayerTable dataSource={dataSource} onViewPlayer={onViewPlayer} onDeletePlayer={onDeletePlayer} />
      <PlayerDetailsModal visible={isViewing} onClose={() => setIsViewing(false)} player={viewingPlayer} />
    </div>
  );
};

export default Players;
