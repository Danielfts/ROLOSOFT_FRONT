import React from 'react';
import { Modal, Descriptions } from 'antd';
import { User } from '../../../types/types';

interface UserDetailsProps {
  visible: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetails: React.FC<UserDetailsProps> = ({ visible, onClose, user }) => {
  return (
    <Modal
      title="Detalles de usuario"
      open={visible}
      footer={null}
      onCancel={onClose}
      width={500}
    >
      {user && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Nombres">{user.firstName}</Descriptions.Item>
          <Descriptions.Item label="Apellidos">{user.lastName}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Teléfono">{user.phone}</Descriptions.Item>
          <Descriptions.Item label="Rol">{user.role}</Descriptions.Item>
          <Descriptions.Item label="CURP">{user.CURP}</Descriptions.Item>
          <Descriptions.Item label="Fecha de nacimiento">{user.birthDate}</Descriptions.Item>
          <Descriptions.Item label="Género">{user.gender}</Descriptions.Item>
          <Descriptions.Item label="Calle y Número">{user.address.address1}</Descriptions.Item>
          <Descriptions.Item label="Colonia">{user.address.address2}</Descriptions.Item>
          <Descriptions.Item label="Ciudad">{user.address.city}</Descriptions.Item>
          <Descriptions.Item label="Estado">{user.address.state}</Descriptions.Item>
          <Descriptions.Item label="Código Postal">{user.address.postalCode}</Descriptions.Item>
          <Descriptions.Item label="País">{user.address.country}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default UserDetails;
