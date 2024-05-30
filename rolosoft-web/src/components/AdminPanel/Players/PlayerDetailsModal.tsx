import React from 'react';
import { Modal, Descriptions } from 'antd';
import { Student } from '../../../types/types';

type PlayerDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  player: Student | null;
};

const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({ visible, onClose, player }) => {
  return (
    <Modal
      title="Detalles del Jugador"
      visible={visible}
      onOk={onClose}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      {player && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Nombres">{player.firstName}</Descriptions.Item>
          <Descriptions.Item label="Apellidos">{player.lastName}</Descriptions.Item>
          <Descriptions.Item label="Email">{player.email}</Descriptions.Item>
          <Descriptions.Item label="Género">{player.gender}</Descriptions.Item>
          <Descriptions.Item label="CURP">{player.CURP}</Descriptions.Item>
          <Descriptions.Item label="Teléfono">{player.phone}</Descriptions.Item>
          <Descriptions.Item label="Fecha de nacimiento">{player.birthDate}</Descriptions.Item>
          <Descriptions.Item label="Rol">{player.role}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default PlayerDetailsModal;
