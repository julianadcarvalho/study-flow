import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  BookOutlined,
  PlusOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const { Header, Content } = Layout;

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/study-plans',
      icon: <BookOutlined />,
      label: 'Planos de Estudo',
    },
    {
      key: '/study-plans/create',
      icon: <PlusOutlined />,
      label: 'Criar Plano',
    },
    {
      key: '/study-materials',
      icon: <ReadOutlined />,
      label: 'Materiais',
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div
        style={{
          width: 200,
          backgroundColor: '#001529',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 16,
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            padding: '0 16px',
            marginBottom: 24,
            textAlign: 'center',
            color: '#fff',
          }}
        >
          StudyFlow
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(item) => navigate(item.key)}
          items={menuItems}
          style={{ flex: 1 }}
        />
      </div>

      <Layout style={{ flex: 1 }}>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}
        >
        </Header>

        <Content
          style={{
            padding: 24,
            background: '#fff',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
};
