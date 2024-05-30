import React from 'react';
import { Modal, Descriptions } from 'antd';
import { School } from '../../../types/types';

interface SchoolDetailsProps {
  visible: boolean;
  onClose: () => void;
  school: School | null;
}

const SchoolDetails: React.FC<SchoolDetailsProps> = ({ visible, onClose, school }) => {
  return (
    <Modal
      title="Detalles de la escuela"
      open={visible}
      footer={null}
      onCancel={onClose}
      width={500}
    >
      {school && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Nombre">{school.name}</Descriptions.Item>
          <Descriptions.Item label="Calle y Número">{school.address.address1}</Descriptions.Item>
          <Descriptions.Item label="Colonia">{school.address.address2}</Descriptions.Item>
          <Descriptions.Item label="Ciudad">{school.address.city}</Descriptions.Item>
          <Descriptions.Item label="Estado">{school.address.state}</Descriptions.Item>
          <Descriptions.Item label="Código Postal">{school.address.postalCode}</Descriptions.Item>
          <Descriptions.Item label="País">{school.address.country}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default SchoolDetails;
