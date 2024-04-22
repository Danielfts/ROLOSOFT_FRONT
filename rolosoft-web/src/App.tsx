import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserAddOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import User from './View/User';
import Match from './View/Match';
import GeneralT from './View/GeneralT';
import GoalT from './View/GoalT';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');

  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  let contentView;
  switch (selectedKey) {
    case '1':
      contentView = <User/>;
      break;
    case '2':
      contentView = <Match />;
      break;
    case '3':
      contentView = <GeneralT />;
      break;
    case '4':
      contentView = <GoalT />;
      break;
    default:
      contentView = <div>Invalid Selection</div>;
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onSelect={({ key }) => handleMenuClick(key as string)}
          items={[
            {
              key: '1',
              icon: <UserAddOutlined />,
              label: 'Registrar Usuario',
            },
            {
              key: '2',
              icon: <CalendarOutlined />,
              label: 'Registrar Partido',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'Tabla General',
            },
            {
              key: '4',
              icon: <UploadOutlined />,
              label: 'Tabla Goleo',
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
          {contentView}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
