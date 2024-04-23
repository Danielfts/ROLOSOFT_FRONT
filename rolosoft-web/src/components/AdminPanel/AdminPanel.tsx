import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, TeamOutlined, CalendarOutlined, UploadOutlined, TrophyOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import Users from './Players/Players';
import Teams from './Teams/Teams';
import Matches from './Matches/Matches';
import GoalsTable from './GoalsTable/GoalsTable';
import GeneralTable from './ScoreTable/ScoreTable';


const { Header, Sider, Content } = Layout;

const AdminPanel: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const renderContent = () => {
    switch (selectedMenu) {
      case '1':
        return <Users />;
      case '2':
        return <Teams />;
      case '3':
        return <Matches />;
      case '4':
        return <GoalsTable />;
      case '5':
        return <GeneralTable />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'Jugadores',
              onClick: () => setSelectedMenu('1'),
            },
            {
              key: '2',
              icon: <TeamOutlined />,
              label: 'Equipos',
              onClick: () => setSelectedMenu('2'),
            },
            {
              key: '3',
              icon: <CalendarOutlined />,
              label: 'Partidos',
              onClick: () => setSelectedMenu('3'),
            },
            {
              key: '4',
              icon: <UploadOutlined />,
              label: 'Tabla Goleo',
              onClick: () => setSelectedMenu('4'),
            },
            {
              key: '5',
              icon: <TrophyOutlined />,
              label: 'Tabla General',
              onClick: () => setSelectedMenu('5'),
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: '100vh',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
