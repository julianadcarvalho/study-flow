import { useEffect, useState } from 'react';
import {
  Card,
  List,
  Spin,
  Typography,
  Button,
  Tag,
  Space,
  Popconfirm,
  message,
  Input,
  Form,
  Modal
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { getStudyPlans, deleteStudyPlan, updateStudyPlanStatus, updateStudyPlan } from '../api/studyPlans';

interface StudyPlan {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

const statusColors = {
  pending: 'orange',
  in_progress: 'blue',
  completed: 'green',
};

const statusLabels = {
  pending: 'Pendente',
  in_progress: 'Em progresso',
  completed: 'Concluído',
};

const StudyPlansPage = () => {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null);
  const [form] = Form.useForm();

  const fetchPlans = async () => {
    try {
      const data = await getStudyPlans();
      setPlans(data);
    } catch (error) {
      console.error('Erro ao buscar planos de estudo', error);
      message.error('Erro ao carregar planos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEdit = (plan: StudyPlan) => {
    setEditingPlan(plan);
    form.setFieldsValue({
      name: plan.name,
      description: plan.description,
      start_date: plan.start_date.slice(0, 10),
      end_date: plan.end_date?.slice(0, 10),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStudyPlan(id);
      message.success('Plano deletado com sucesso!');
      fetchPlans();
    } catch {
      message.error('Erro ao deletar plano');
    }
  };

  const handleStatusChange = async (id: number, newStatus: StudyPlan['status']) => {
    try {
      await updateStudyPlanStatus(id, newStatus);
      message.success('Status atualizado');
      fetchPlans();
    } catch {
      message.error('Erro ao atualizar status');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = async (values: any) => {
    if (editingPlan) {
      try {
        await updateStudyPlan(editingPlan.id, values);
        message.success('Plano atualizado com sucesso!');
        fetchPlans();
      } catch {
        message.error('Erro ao atualizar plano');
      }
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingPlan(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f0f2f5',
        padding: '32px 24px',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: 1500 }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '32px 24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
            marginBottom: 32,
            borderRadius: 8,
            textAlign: 'center',
            maxWidth: 1200,
            marginLeft: '54px',
          }}
        >
          <Typography.Title level={2} style={{ margin: 0, color: '#001529' }}>
            Meus Planos de Estudo
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginTop: 8, fontSize: 16 }}>
            Acompanhe, edite e organize seus planos de aprendizado aqui.
          </Typography.Paragraph>
        </div>


        <Modal
          title="Editar Plano de Estudo"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item name="name" label="Nome do Plano" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="description" label="Descrição">
              <Input.TextArea rows={3} placeholder="Descreva o foco do plano" />
            </Form.Item>

            <Form.Item name="start_date" label="Data de Início" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>

            <Form.Item name="end_date" label="Data de Fim">
              <Input type="date" />
            </Form.Item>
          </Form>
        </Modal>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 64 }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            grid={{ gutter: 24, xs: 1, sm: 2, md: 3, xl: 6 }} // 6 = 24 / 4 → 4 colunas
            dataSource={plans}
            renderItem={(plan) => {
              const cardBorder = {
                pending: '#fa8c16',
                in_progress: '#1890ff',
                completed: '#52c41a',
              };

              const bgColor = {
                pending: '#fff',
                in_progress: '#e6f7ff',
                completed: '#f6ffed',
              };

              const icon = {
                pending: '⏳',
                in_progress: '🔄',
                completed: '✅',
              };

              return (
                <List.Item>
                  <Card
                    title={
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{icon[plan.status]}</span>
                        <span>{plan.name}</span>
                      </span>
                    }
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      borderLeft: `4px solid ${cardBorder[plan.status]}`,
                      backgroundColor: bgColor[plan.status],
                    }}
                    actions={[
                      <EditOutlined key="edit" onClick={() => handleEdit(plan)} />,
                      <Popconfirm
                        title="Tem certeza que deseja excluir este plano?"
                        onConfirm={() => handleDelete(plan.id)}
                        okText="Sim"
                        cancelText="Não"
                      >
                        <DeleteOutlined key="delete" />
                      </Popconfirm>,
                    ]}
                  >
                    <div style={{ flex: 1 }}>
                      <p><strong>Início:</strong> {plan.start_date}</p>
                      {plan.end_date && <p><strong>Fim:</strong> {plan.end_date}</p>}
                      {plan.description && <p>{plan.description}</p>}
                      <p>
                        <strong>Status:</strong>{' '}
                        <Tag color={statusColors[plan.status]}>
                          {statusLabels[plan.status]}
                        </Tag>
                      </p>
                    </div>

                    <Space style={{ marginTop: 16 }}>
                      <Button
                        type="link"
                        icon={<ClockCircleOutlined />}
                        onClick={() => handleStatusChange(plan.id, 'in_progress')}
                      >
                        Em Progresso
                      </Button>
                      <Button
                        type="link"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleStatusChange(plan.id, 'completed')}
                      >
                        Concluir
                      </Button>
                    </Space>
                  </Card>
                </List.Item>
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StudyPlansPage;
