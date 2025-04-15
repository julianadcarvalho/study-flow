import { Layout } from 'antd';
import { MainLayout } from '../pages/mainLayout';
const { Content } = Layout;

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <MainLayout />
      <Layout>
        <Content style={{ padding: '24px 48px', background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
