import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Meta } = Card;

const players = [
  {
    id: '1',
    imgSrc: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    name: "John Doe",
  },
  {
    id: '2',
    imgSrc: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    name: "Jane Smith",
  },
];

const Users: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/registerUser');
  };

  return (
    <div>
      <Button type="primary" onClick={handleRegisterClick} style={{ marginBottom: 20 }}>
        Registra Nuevo Usuario
      </Button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {players.map((player) => (
          <Card
            key={player.id}
            style={{ width: 300 }}
            cover={<img alt={player.name} src={player.imgSrc} />}
            actions={[
              <EditOutlined key="edit" />,
              <DeleteOutlined key="delete" />,
            ]}
          >
            <Meta title={player.name} />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Users;
