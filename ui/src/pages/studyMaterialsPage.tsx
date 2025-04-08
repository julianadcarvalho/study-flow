/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
    Card,
    List,
    Typography,
    Tag,
    message,
    Tooltip,
    Modal,
    Input,
    Form,
    Select,
} from 'antd';
import {
    EditOutlined,
    EyeOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import {
    getStudyMaterials,
    updateMaterialStatus,
    updateStudyMaterial,
} from '../api/studyMaterials';

interface StudyMaterial {
    id: number;
    title: string;
    description?: string;
    type: 'video' | 'article' | 'pdf' | 'book';
    link: string;
    status: 'pendente' | 'concluído';
}

const materialTypeColors = {
    video: 'volcano',
    article: 'blue',
    pdf: 'purple',
    book: 'green',
};

const statusText: Record<StudyMaterial['status'], string> = {
    pendente: 'Pendente',
    concluído: 'Concluído',
};

const StudyMaterialsPage = () => {
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);
    const [form] = Form.useForm();

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            const response = await getStudyMaterials();
            const extractedMaterials: StudyMaterial[] = response.map((material: any) => ({
                id: material.id,
                title: material.titulo || 'Sem título',
                description: material.studyPlan?.description || '',
                type: material.tipo || 'article',
                link: material.url || '#',
                status: material.status as 'pendente' | 'concluído',
            }));
            setMaterials(extractedMaterials);
        } catch (error) {
            console.error('Erro ao buscar materiais', error);
            message.error('Erro ao carregar materiais');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleMarkAsCompleted = async (id: number) => {
        try {
            await updateMaterialStatus(id, 'concluído');
            message.success('Material marcado como concluído!');
            fetchMaterials();
        } catch {
            message.error('Erro ao atualizar status');
        }
    };

    const handleEdit = (material: StudyMaterial) => {
        setEditingMaterial(material);
        form.setFieldsValue({
            title: material.title,
            description: material.description,
            type: material.type,
            link: material.link,
        });
        setIsModalVisible(true);
    };

    const handleFormSubmit = async (values: any) => {
        if (editingMaterial) {
            try {
                const updatedMaterial = {
                    title: values.title,
                    description: values.description,
                    status: editingMaterial.status,
                    type: values.type,
                    link: values.link,
                };
                await updateStudyMaterial(editingMaterial.id, updatedMaterial);
                message.success('Material atualizado com sucesso!');
                fetchMaterials();
            } catch {
                message.error('Erro ao atualizar material');
            }
        }
        setIsModalVisible(false);
        form.resetFields();
        setEditingMaterial(null);
    };

    return (
        <div style={{ padding: 32, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
                <div
                    style={{
                        background: '#fff',
                        padding: '32px 24px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        borderRadius: 8,
                        textAlign: 'center',
                        width: '100%',
                    }}
                >
                    <Typography.Title level={2} style={{ marginBottom: 0 }}>
                        Meus Materiais de Estudo
                    </Typography.Title>
                </div>

                <div style={{ width: '100%' }}>
                    <List
                        grid={{ gutter: 24, column: 4 }}
                        dataSource={materials}
                        loading={loading}
                        renderItem={(material) => (
                            <List.Item>
                                <Card
                                    title={material.title || 'Sem título'}
                                    style={{
                                        borderRadius: 8,
                                        border: material.status === 'concluído' ? '1px solid #b7eb8f' : '1px solid #ffa39e',
                                        backgroundColor: material.status === 'concluído' ? '#f6ffed' : '#fff',
                                    }}
                                    extra={
                                        <Tag color={materialTypeColors[material.type] || 'default'}>
                                            {material.type.toUpperCase()}
                                        </Tag>
                                    }
                                    actions={[
                                        <Tooltip title="Abrir material">
                                            <EyeOutlined key="link" onClick={() => window.open(material.link, '_blank')} />
                                        </Tooltip>,
                                        <Tooltip title="Marcar como concluído">
                                            <CheckCircleOutlined key="mark-read" onClick={() => handleMarkAsCompleted(material.id)} />
                                        </Tooltip>,
                                        <Tooltip title="Editar material">
                                            <EditOutlined key="edit" onClick={() => handleEdit(material)} />
                                        </Tooltip>,
                                    ]}
                                >
                                    {material.description && <p>{material.description}</p>}
                                    <Tag color={material.status === 'concluído' ? 'green' : 'red'}>
                                        {statusText[material.status]}
                                    </Tag>
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
            </div>

            <Modal
                title="Editar Material de Estudo"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                okText="Salvar"
                cancelText="Cancelar"
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item name="title" label="Título" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Descrição">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item name="type" label="Tipo" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="video">Vídeo</Select.Option>
                            <Select.Option value="article">Artigo</Select.Option>
                            <Select.Option value="pdf">PDF</Select.Option>
                            <Select.Option value="book">Livro</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="link" label="Link" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default StudyMaterialsPage;
