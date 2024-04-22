import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card } from 'antd';

const { Meta } = Card;

const teams = [
  {
    id: '1',
    imgSrc: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    name: "Equipo 1",
  },
  {
    id: '2',
    imgSrc: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    name: "Equipo 2",
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
      {teams.map((team) => (
        <Card
          key={team.id}
          style={{ width: 300 }}
          cover={<img alt={team.name} src={team.imgSrc} />}
          actions={[
            <EditOutlined key="edit" onClick={() => navigate('/Admin')} />,
            <DeleteOutlined key="delete" />,
          ]}
        >
          <Meta
            title={team.name}
          />
        </Card>
      ))}
    </div>
  );
};

export default Dashboard;
