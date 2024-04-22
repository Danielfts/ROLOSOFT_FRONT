import React, { useState } from 'react';
import { Avatar, Button, Card, Layout, theme } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import Login from './Login';
import Admin from './Admin';
import { useNavigate } from 'react-router-dom';


const { Header, Content } = Layout;
const { Meta } = Card;

const App: React.FC = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // For demonstration purposes, assuming successful login
    setIsLoggedIn(true);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0, background: theme.useToken().token.colorBgContainer }}>
      </Header>
      <Content style={{ margin: '24px 16px', padding: 24, background: theme.useToken().token.colorBgContainer }}>
        {isLoggedIn ? (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Card
              style={{ width: 300 }}
              cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
              onClick={() => {
                navigate('/Admin');
              }}
            >
              <Meta
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                title="Card 1"
                description="This is the description for Card 1"
              />
            </Card>
            <Card
              style={{ width: 300 }}
              cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
              onClick={() => {
                navigate('/Admin');
              }}
            >
              <Meta
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                title="Card 2"
                description="This is the description for Card 2"
              />
            </Card>
          </div>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </Content>
    </Layout>
  );
};

export default App;