import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserAddOutlined, CalendarOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';

import Users from './Users/Users';
import Teams from './Teams/Teams';
import Matches from './Matches/Matches';
import GoalTable from './GoalsTable/GoalsTable';
import ScoreTable from './ScoreTable/ScoreTable';

const { Header, Sider, Content } = Layout;

const AdminPanel: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['user']}
          items={[
            {
              key: 'users',
              icon: <UserAddOutlined />,
              label: <Link to="/components/Users/Users">Registrar Usuario</Link>,
            },
            {
                key: 'teams',
                icon: <UserAddOutlined />,
                label: <Link to="/components/Teams/Teams">Registrar Equipo</Link>,
              },
            {
              key: 'matches',
              icon: <CalendarOutlined />,
              label: <Link to="/components/Match/Match">Registrar Partido</Link>,
            },
            {
              key: 'goals-table',
              icon: <UploadOutlined />,
              label: <Link to="/components/GoalsTable/GoalsTable">Tabla Goleo</Link>,
            },
            {
              key: 'score-table',
              icon: <UploadOutlined />,
              label: <Link to="/components/ScoreTable/ScoreTable">Tabla General</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: 'var(--color-bg-container)' }}>
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
            background: 'var(--color-bg-container)',
            borderRadius: 'var(--border-radius-lg)',
          }}
        >
          <Routes>
            <Route path="/player" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/score" element={<ScoreTable />} />
            <Route path="/goal" element={<GoalTable />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
