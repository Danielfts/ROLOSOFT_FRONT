import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card } from 'antd';

const { Meta } = Card;

// Sample data for players
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

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
      {players.map((player) => (
        <Card
          key={player.id}
          style={{ width: 300 }}
          cover={<img alt={player.name} src={player.imgSrc} />}
          actions={[
            <EditOutlined key="edit" onClick={() => navigate('/Admin')} />,
            <DeleteOutlined key="delete" />,
          ]}
        >
          <Meta
            title={player.name}
          />
        </Card>
      ))}
    </div>
  );
};

export default Users;
