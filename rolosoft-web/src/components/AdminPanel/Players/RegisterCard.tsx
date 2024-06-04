import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { Student } from '../../../types/types';
import { registerGreenCard } from '../../../services/cardService';

type RegisterCardProps = {
  visible: boolean;
  onCancel: () => void;
  student: Student;
};

const RegisterCard: React.FC<RegisterCardProps> = ({ visible, onCancel, student }) => {
  const [reason, setReason] = useState('');

  const handleOk = async () => {
    const payload = { reason };
    const success = await registerGreenCard(student.CURP, payload);
    if (success) {
      message.success('Green card registered successfully');
      onCancel();
    } else {
      message.error('Failed to register green card');
    }
  };

  return (
    <Modal
      visible={visible}
      title="Register Green Card"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Submit
        </Button>,
      ]}
    >
      <Input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for green card"
      />
    </Modal>
  );
};

export default RegisterCard;
