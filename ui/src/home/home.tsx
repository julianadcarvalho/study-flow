import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Switch,
  message,
  Progress,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { getStudyMaterials } from '../api/studyMaterials';
import {
  BookOutlined,
  PlusCircleOutlined,
  ReadOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const HomePage = () => {
  const navigate = useNavigate();
  const [focusMode, setFocusMode] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggleFocusMode = (checked: boolean) => {
    setFocusMode(checked);
    if (checked) {
      message.success('Modo foco ativado! Todas as notificações estão desativadas.');
    } else {
      message.info('Modo foco desativado.');
    }
  };

  const fetchProgress = async () => {
    try {
      const materials = await getStudyMaterials();
      const total = materials.length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const completed = materials.filter((m: any) => m.status === 'concluído').length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      setProgress(percentage);
    } catch (error) {
      console.error('Erro ao buscar progresso', error);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return (
    <div
      style={{
        minHeight: '85vh',
        width: '85vw',
        display: 'grid',
        placeItems: 'center',
        backgroundColor: '#f0f2f5',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <Row justify="space-between" align="middle">
            <Col xs={24} md="auto">
              <Title level={2} style={{ marginBottom: 0 }}>Bem-vindo ao StudyFlow!</Title>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                O que você deseja fazer hoje?
              </Paragraph>
            </Col>
            <Col xs={24} md="auto" style={{ marginTop: 16 }}>
              <div>
                <span style={{ fontWeight: 500, marginRight: 8 }}>Modo Foco</span>
                <Switch
                  checked={focusMode}
                  onChange={toggleFocusMode}
                  checkedChildren="Ativo"
                  unCheckedChildren="Inativo"
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Progresso */}
        <div style={{ marginBottom: 32 }}>
          <Title level={5}>Seu progresso geral:</Title>
          <Progress percent={progress} status="active" />
        </div>

        {/* Cards */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card
              title="Ver planos de estudo"
              bordered={false}
              hoverable
              actions={[
                <Button type="primary" block onClick={() => navigate('/study-plans')}>
                  Acessar
                </Button>,
              ]}
            >
              <BookOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
              <Paragraph>Veja todos os seus planos e acompanhe seu progresso.</Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              title="Criar novo plano"
              bordered={false}
              hoverable
              actions={[
                <Button type="primary" block onClick={() => navigate('/study-plans/create')}>
                  Criar
                </Button>,
              ]}
            >
              <PlusCircleOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 16 }} />
              <Paragraph>Comece um novo plano de estudos personalizado.</Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              title="Materiais de estudo"
              bordered={false}
              hoverable
              actions={[
                <Button type="primary" block onClick={() => navigate('/study-materials')}>
                  Ver materiais
                </Button>,
              ]}
            >
              <ReadOutlined style={{ fontSize: 32, color: '#fa8c16', marginBottom: 16 }} />
              <Paragraph>Gerencie livros, vídeos, artigos e outros conteúdos.</Paragraph>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
