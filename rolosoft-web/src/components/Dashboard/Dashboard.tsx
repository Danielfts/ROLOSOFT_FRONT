import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined} from '@ant-design/icons';
import { Card } from 'antd';

const { Meta } = Card;

const tournaments = [
  { year: '2021', title: "2021 Tournament", description: "Details of the 2021 tournament." },
  { year: '2022', title: "2022 Tournament", description: "Details of the 2022 tournament." },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
      {tournaments.map((tournament) => (
        <Card
          key={tournament.year}
          style={{ width: 300 }}
          actions={[
            <EditOutlined key="edit" onClick={() => navigate('/AdminPanel')} />,
            <DeleteOutlined key="delete" />,
          ]}
        >
          <Meta
            title={tournament.title}
            description={tournament.description}
          />
        </Card>
      ))}
    </div>
  );
};

export default Dashboard;
