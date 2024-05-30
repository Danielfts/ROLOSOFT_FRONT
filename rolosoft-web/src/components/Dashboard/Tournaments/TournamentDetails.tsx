import React from 'react';
import { Modal, Descriptions } from 'antd';
import { Tournament } from '../../../types/types';

interface TournamentDetailsProps {
  visible: boolean;
  onClose: () => void;
  tournament: Tournament | null;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({ visible, onClose, tournament }) => {
  return (
    <Modal
      title="Detalles del torneo"
      open={visible}
      footer={null}  // This removes the footer
      onCancel={onClose}
      width={500}
    >
      {tournament && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Nombre">{tournament.name}</Descriptions.Item>
          <Descriptions.Item label="Fecha inicio">{tournament.startDate}</Descriptions.Item>
          <Descriptions.Item label="Fecha fin">{tournament.endDate}</Descriptions.Item>
          <Descriptions.Item label="Calle y Número">{tournament.address.address1}</Descriptions.Item>
          <Descriptions.Item label="Colonia">{tournament.address.address2}</Descriptions.Item>
          <Descriptions.Item label="Ciudad">{tournament.address.city}</Descriptions.Item>
          <Descriptions.Item label="Estado">{tournament.address.state}</Descriptions.Item>
          <Descriptions.Item label="Código Postal">{tournament.address.postalCode}</Descriptions.Item>
          <Descriptions.Item label="País">{tournament.address.country}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default TournamentDetails;
