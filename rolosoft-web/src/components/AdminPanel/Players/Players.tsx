import React, { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import axios from 'axios';
import { fetchRegisteredStudent } from '../../../services/studentService';
import { Student } from '../../../types/types';
import PlayerDetailsModal from './PlayerDetailsModal';
import PlayerTable from './PlayerTable';

const Players: React.FC = () => {
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingPlayer, setViewingPlayer] = useState<Student | null>(null);
  const [dataSource, setDataSource] = useState<Student[]>([]);

  useEffect(() => {
    fetchRegisteredStudent()
      .then(setDataSource)
      .catch(() => message.error('Error fetching registered students'));
  }, []);

  const onViewPlayer = (record: Student) => {
    setIsViewing(true);
    setViewingPlayer(record);
  };

  const onDeletePlayer = (record: Student) => {
    Modal.confirm({
      title: "Estas seguro que desea eliminar a este jugador?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const headers = { Authorization: token };
          const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/players/${record.CURP}`, { headers });

          if (response.status === 200) {
            setDataSource((prev) => prev.filter((player) => player.CURP !== record.CURP));
            message.success("Jugador eliminado exitosamente!");
          } else {
            message.error('Fallo al eliminar jugador');
          }
        } catch (error) {
          message.error('Fallo al eliminar jugador: ' + error);
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
