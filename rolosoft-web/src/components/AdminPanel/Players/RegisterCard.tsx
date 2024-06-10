import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { Student } from '../../../types/types';
import { registerGreenCard } from '../../../services/studentService';

type RegisterCardProps = {
  visible: boolean;
  onCancel: () => void;
  student: Student;
};

const RegisterCard: React.FC<RegisterCardProps> = ({ visible, onCancel, student }) => {
  const [reason, setReason] = useState('');

  const handleOk = async () => {
    if (!reason.trim()) {
      message.error('Por favor, ingrese la razón para la tarjeta verde');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      message.error('Falta el token de autorización');
      return;
    }

    const success = await registerGreenCard(token, student.id, reason);
    if (success) {
      message.success('¡Tarjeta verde registrada con éxito!');
      setReason('');
    }
  };

  return (
    <Modal
      open={visible}
      title="Registrar Tarjeta Verde"
      onCancel={onCancel} 
      footer={null}
    >
      <Input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Razón para la tarjeta verde"
        style={{ marginBottom: '16px' }}
      />
      <div style={{ textAlign: 'center' }}> 
        <Button type="primary" onClick={handleOk}>
          Registrar
        </Button>
      </div>
    </Modal>
  );
};

export default RegisterCard;
