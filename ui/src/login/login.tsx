import { useState } from 'react';
import { Button, Form, Input, Tabs, message, Typography } from 'antd';
import { createUser } from '../api/users';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (values: { email: string; password: string }) => {
    message.success(`Login realizado: ${values.email}`);
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ email: values.email }));
      navigate('/home');
    }, 1000);
  };

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      await createUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      message.success('Usuário cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      message.error('Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          padding: '32px',
          maxWidth: 420,
          width: '100%',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <Title level={3} style={{ marginBottom: 0 }}>StudyFlow</Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>Acesse sua jornada de estudos</Paragraph>
        </div>

        <Tabs defaultActiveKey="login" centered>
          <Tabs.TabPane tab="Login" key="login">
            <Form onFinish={handleLogin} layout="vertical">
              <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="password" label="Senha" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Entrar
                </Button>
              </Form.Item>
            </Form>

            <Button
              type="default"
              block
              style={{ marginTop: 12 }}
              onClick={handleGoogleLogin}
            >
              Entrar com Google
            </Button>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Primeiro Acesso" key="register">
            <Form onFinish={handleRegister} layout="vertical">
              <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="password" label="Senha" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Cadastrar
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};
