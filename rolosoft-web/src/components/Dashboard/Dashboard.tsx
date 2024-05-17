import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import Users from './Users/Users';
import Schools from './Schools/Schools';
import Tournaments from './Tournaments/Tournaments';

const { Header, Sider, Content } = Layout;

const Dashboard: React.FC = () => {
  // Initialize state with localStorage value or default to '1'
  const [selectedMenu, setSelectedMenu] = useState(() => {
    const savedMenu = localStorage.getItem('selectedMenu');
    return savedMenu ? savedMenu : '1';
  });
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    localStorage.setItem('selectedMenu', selectedMenu);
  }, [selectedMenu]);

  const renderContent = () => {
    switch (selectedMenu) {
      case '1':
        return <Users />;
      case '2':
        return <Schools />;
      case '3':
        return <Tournaments />;
      default:
        return <div>Selecciona una acción</div>;
    }
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}  // Use selectedKeys instead of defaultSelectedKeys
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'Usuarios',
              onClick: () => setSelectedMenu('1'),
            },
            {
              key: '2',
              icon: <TeamOutlined />,
              label: 'Escuelas',
              onClick: () => setSelectedMenu('2'),
            },
            {
              key: '3',
              icon: <TrophyOutlined />,
              label: 'Torneos',
              onClick: () => setSelectedMenu('3'),
            },
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

export default Dashboard;
