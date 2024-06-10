import React from 'react';
import { Modal, Descriptions, Avatar, Image } from 'antd';
import { GreenCard, Student } from '../../../types/types';
import { UserOutlined } from '@ant-design/icons';

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
      width={600} 
    >
      {player && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            {player.student.photoFileName ? (
              <Image
                width={150}
                src={`${process.env.REACT_APP_BASE_URL}/static/${player.student.photoFileName}`}
                alt={`${player.firstName} ${player.lastName}`}
              />
            ) : (
              <Avatar
                size={150}
                icon={<UserOutlined />}
              />
            )}
            <h3 style={{ marginTop: '16px' }}>{`${player.firstName} ${player.lastName}`}</h3>
          </div>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Email">{player.email}</Descriptions.Item>
            <Descriptions.Item label="Género">{player.gender}</Descriptions.Item>
            <Descriptions.Item label="CURP">{player.CURP}</Descriptions.Item>
            <Descriptions.Item label="Teléfono">{player.phone}</Descriptions.Item>
            <Descriptions.Item label="Fecha de nacimiento">{new Date(player.birthDate).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label="Rol">{player.role}</Descriptions.Item>
            <Descriptions.Item label="Tarjetas Verdes">
              {player.student.greenCards.length > 0 ? (
                player.student.greenCards.map((card: GreenCard) => (
                  <div key={card.id} style={{ marginBottom: '8px' }}>
                    <strong>Fecha:</strong> {new Date(card.createdAt).toLocaleDateString()}<br />
                    <strong>Razón:</strong> {card.reason}
                  </div>
                ))
              ) : (
                <span>Sin tarjetas verdes</span>
              )}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );
};

export default PlayerDetailsModal;
