import React from 'react';
import { Modal, Descriptions, List, Avatar, Image } from 'antd';
import { School, Student } from '../../../types/types';
import { UserOutlined } from '@ant-design/icons';

type TeamDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  school: School | null;
};

const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({ visible, onClose, school }) => {
  return (
    <Modal
      title="Detalles de la Escuela"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
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
            <Descriptions.Item label="Nombre">{school.name}</Descriptions.Item>
            <Descriptions.Item label="Sponsor">{school.sponsor}</Descriptions.Item>
            <Descriptions.Item label="Calle">{school.address.address1}</Descriptions.Item>
            <Descriptions.Item label="Ciudad">{school.address.city}</Descriptions.Item>
            <Descriptions.Item label="Estado">{school.address.state}</Descriptions.Item>
            <Descriptions.Item label="Codigo Postal">{school.address.postalCode}</Descriptions.Item>
            <Descriptions.Item label="Pais">{school.address.country}</Descriptions.Item>
            <Descriptions.Item label="Jugadores">
              <List
                dataSource={school.students}
                renderItem={(student: Student) => (
                  <List.Item key={student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={student.student.photoFileName ? `${process.env.REACT_APP_BASE_URL}/static/${student.student.photoFileName}` : undefined}
                          icon={!student.student.photoFileName ? <UserOutlined /> : undefined}
                        />
                      }
                      title={`${student.firstName} ${student.lastName}`}
                      description={
                        <>
                          <div>CURP: {student.CURP}</div>
                          <div>Email: {student.email}</div>
                          <div>Posición: {student.student.fieldPosition}</div>
                          <div>Numero Camiseta: {student.student.shirtNumber}</div>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );
};

export default TeamDetailsModal;
