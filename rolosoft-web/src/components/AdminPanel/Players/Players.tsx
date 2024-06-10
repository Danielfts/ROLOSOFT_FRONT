import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { fetchRegisteredStudent } from '../../../services/studentService';
import { Student } from '../../../types/types';
import PlayerTable from './PlayerTable';
import PlayerDetailsModal from './PlayerDetailsModal';

const Players: React.FC = () => {
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingPlayer, setViewingPlayer] = useState<Student | null>(null);
  const [dataSource, setDataSource] = useState<Student[]>([]);

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

  useEffect(() => {
    fetchStudents();
  }, []);

  const onViewPlayer = (record: Student) => {
    setIsViewing(true);
    setViewingPlayer(record);
  };

  const onEditPlayer = (updatedPlayer: Student) => {
    setDataSource(prevDataSource =>
      prevDataSource.map(player =>
        player.id === updatedPlayer.id ? updatedPlayer : player
      )
    );
    message.success("Player updated successfully");
  };

  const onRefreshTable = () => {
    fetchStudents(); 
  };

  return (
    <div>
      <PlayerTable
        dataSource={dataSource}
        onViewPlayer={onViewPlayer}
        onEditPlayer={onEditPlayer}
        onRefreshTable={onRefreshTable}
      />
      <PlayerDetailsModal
        visible={isViewing}
        onClose={() => setIsViewing(false)}
        player={viewingPlayer}
      />
    </div>
  );
};

export default Players;
