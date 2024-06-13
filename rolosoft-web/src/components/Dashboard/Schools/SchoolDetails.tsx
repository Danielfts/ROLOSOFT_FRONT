import React from 'react';
import { Modal, Descriptions, Image, Avatar } from 'antd';
import { School } from '../../../types/types';
import { UserOutlined } from '@ant-design/icons';

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
      onOk={onClose}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      {school && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            {school.shieldFileName ? (
              <Image
                width={150}
                src={`${process.env.REACT_APP_BASE_URL}/static/${school.shieldFileName}`}
                alt={`${school.name} Shield`}
              />
            ) : (
              <Avatar
                size={150}
                icon={<UserOutlined />}
              />
            )}
            <h3 style={{ marginTop: '16px' }}>{school.name}</h3>
          </div>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Calle y Número">{school.address.address1}</Descriptions.Item>
            <Descriptions.Item label="Colonia">{school.address.address2}</Descriptions.Item>
            <Descriptions.Item label="Ciudad">{school.address.city}</Descriptions.Item>
            <Descriptions.Item label="Estado">{school.address.state}</Descriptions.Item>
            <Descriptions.Item label="Código Postal">{school.address.postalCode}</Descriptions.Item>
            <Descriptions.Item label="País">{school.address.country}</Descriptions.Item>
            <Descriptions.Item label="Clave">{school.clave}</Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );
};

export default SchoolDetails;
