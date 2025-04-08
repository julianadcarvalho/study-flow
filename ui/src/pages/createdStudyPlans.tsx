import { useState } from 'react';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import {
    Button,
    Card,
    Form,
    Input,
    DatePicker,
    Select,
    Space,
    Typography,
    message,
} from 'antd';
import { createStudyMaterial } from '../api/studyMaterials';
import { createStudyPlan } from '../api/studyPlans';
import { useNavigate } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export const CreateStudyPlanPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [materialForm] = Form.useForm();
    const [materials, setMaterials] = useState([
        { key: Date.now(), title: '', type: '', link: '' }
    ]);

    const [loading, setLoading] = useState(false);
    const [createdPlanId, setCreatedPlanId] = useState<number | null>(null);
    const [showMaterialForm, setShowMaterialForm] = useState(false);
    const [iaSuggestionText, setIaSuggestionText] = useState<string | null>(null);

    const handleAddMaterial = () => {
        setMaterials([...materials, { key: Date.now(), title: '', type: '', link: '' }]);
    };

    const handleMaterialChange = (key: number, field: string, value: string) => {
        const updated = materials.map((material) =>
            material.key === key ? { ...material, [field]: value } : material
        );
        setMaterials(updated);
    };

    const fetchIASuggestion = async (descricao: string) => {
        try {
            const res = await fetch('http://localhost:3000/ia/sugerir', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao }),
            });

            const data = await res.json();
            const sugestao = data?.sugestao;

            if (sugestao?.trim()) {
                setIaSuggestionText(sugestao);
                setShowMaterialForm(true);
            } else {
                message.warning('A IA não retornou sugestões.');
            }
        } catch (error) {
            console.error(error);
            message.error('Erro ao buscar sugestão da IA');
        }
    };

    const extrairMateriaisDaSugestao = (texto: string) => {
        const linhas = texto.split('\n').filter(Boolean);

        return linhas.map((linha) => {
            const partes = linha.split(',').map((parte) => parte.trim());

            const titulo = partes.find((p) => p.startsWith('1:'))?.replace('1:', '').trim() || '';
            const tipo = partes.find((p) => p.startsWith('2:'))?.replace('2:', '').trim() || '';
            const link = partes.find((p) => p.startsWith('3:'))?.replace('3:', '').trim() || '';

            return {
                title: titulo,
                type: tipo,
                link: link,
            };
        });
    };

    const aplicarSugestaoIa = () => {
        const materiaisSugeridos = extrairMateriaisDaSugestao(iaSuggestionText || '');

        if (materiaisSugeridos.length) {
            setMaterials(materiaisSugeridos.map((material) => ({ ...material, key: Date.now() + Math.random() })));

            materialForm.setFieldsValue({
                materials: materiaisSugeridos.map((m) => ({
                    title: m.title,
                    type: m.type,
                    link: m.link,
                })),
            });

            message.success('Sugestões da IA aplicadas com sucesso!');
        } else {
            message.warning('Não foi possível extrair os materiais da sugestão da IA.');
        }
    };

    interface FormValues {
        name: string;
        description?: string;
        dates: [moment.Moment, moment.Moment];
    }

    const handleSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            const [start, end] = values.dates;
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const studyPlan = await createStudyPlan({
                name: values.name,
                description: values.description,
                start_date: start.format('YYYY-MM-DD'),
                end_date: end?.format('YYYY-MM-DD') || undefined,
                user_id: user.id,
            });

            message.success('Plano criado! Agora adicione seus materiais.');
            setCreatedPlanId(studyPlan.id);
            setShowMaterialForm(true);

            if (values.description) {
                await fetchIASuggestion(values.description);
            }
        } catch (err) {
            console.error(err);
            message.error('Erro ao criar plano de estudo.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitMaterials = async () => {
        try {
            await materialForm.validateFields();
            if (!createdPlanId) return;

            await Promise.all(
                materials.map((material) =>
                    createStudyMaterial({
                        planoId: createdPlanId,
                        tipo: material.type as 'pdf' | 'vídeo' | 'artigo' | 'livro',
                        titulo: material.title,
                        url: material.link,
                    })
                )
            );

            message.success('Materiais adicionados com sucesso!');
            setShowMaterialForm(false);
            setMaterials([{ key: Date.now(), title: '', type: '', link: '' }]);
            form.resetFields();
            materialForm.resetFields();
            navigate('/home');
        } catch (err) {
            console.error(err);
            message.error('Erro ao adicionar materiais.');
        }
    };

    const handleRemoveMaterial = (keyToRemove: number) => {
        setMaterials((prev) => prev.filter((material) => material.key !== keyToRemove));
        const currentValues = materialForm.getFieldValue('materials') || [];
        materialForm.setFieldsValue({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            materials: currentValues.filter((_: any, idx: number) => materials[idx].key !== keyToRemove),
        });
    };

    return (
        <div className="study-plan-page"
            style={{
                padding: '48px 16px',
                backgroundColor: '#f5f7fa',
                minHeight: '100vh',
                display: 'block',
            }}
        >
            <div style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
                <Title level={2} style={{ marginBottom: 24, textAlign: 'center' }}>
                    Criar Novo Plano de Estudo
                </Title>
            </div>

            <Card style={{ maxWidth: 800, margin: '0 auto', borderRadius: 8 }}>
                <Form layout="vertical" onFinish={handleSubmit} form={form}>
                    <Form.Item
                        label="Nome do plano"
                        name="name"
                        rules={[{ required: true, message: 'O nome do plano é obrigatório' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Descrição" name="description">
                        <Input.TextArea
                            rows={3}
                            onBlur={(e) => {
                                const desc = e.target.value;
                                if (desc) fetchIASuggestion(desc);
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Período"
                        name="dates"
                        rules={[{ required: true, message: 'O período é obrigatório' }]}
                    >
                        <RangePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Criar plano de estudo
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {iaSuggestionText && (
                <Card
                    style={{
                        background: '#f4f6fb',
                        borderLeft: '4px solid #1677ff',
                        marginTop: 24,
                        maxWidth: 800,
                        marginInline: 'auto',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                    }}
                    title="💬 Sugestão da IA"
                    extra={
                        <div>
                            <Button type="primary" onClick={aplicarSugestaoIa}>
                                Aplicar sugestão
                            </Button>
                            <Button size="small" danger onClick={() => setIaSuggestionText(null)}>
                                Ignorar
                            </Button>
                        </div>
                    }
                >
                    <ReactMarkdown>{iaSuggestionText}</ReactMarkdown>
                </Card>
            )}

            {showMaterialForm && (
                <Card style={{ marginTop: 24, maxWidth: 800, marginInline: 'auto' }}>
                    <Title level={4}>Adicionar Materiais de Estudo</Title>
                    <Form layout="vertical" form={materialForm}>
                        {materials.map((material, index) => (
                            <Card
                                key={index}
                                type="inner"
                                title={`Material ${index + 1}`}
                                style={{ marginBottom: 16 }}
                                extra={
                                    <CloseOutlined
                                        onClick={() => handleRemoveMaterial(material.key)}
                                        style={{ color: 'red', fontSize: 16, cursor: 'pointer' }}
                                    />
                                }
                            >
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Form.Item
                                        label="Título"
                                        name={['materials', index, 'title']}
                                        rules={[{ required: true, message: 'O título é obrigatório' }]}
                                    >
                                        <Input
                                            placeholder="Título"
                                            value={material.title}
                                            onChange={(e) => handleMaterialChange(material.key, 'title', e.target.value)}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Tipo"
                                        name={['materials', index, 'type']}
                                        rules={[{ required: true, message: 'O tipo é obrigatório' }]}
                                    >
                                        <Select
                                            placeholder="Tipo"
                                            value={material.type}
                                            onChange={(value) => handleMaterialChange(material.key, 'type', value)}
                                        >
                                            <Option value="livro">Livro</Option>
                                            <Option value="artigo">Artigo</Option>
                                            <Option value="vídeo">Vídeo</Option>
                                            <Option value="pdf">PDF</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Link"
                                        name={['materials', index, 'link']}
                                        rules={[
                                            { required: true, message: 'O link é obrigatório' },
                                            { type: 'url', message: 'Insira um link válido' },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Link"
                                            value={material.link}
                                            onChange={(e) => handleMaterialChange(material.key, 'link', e.target.value)}
                                        />
                                    </Form.Item>
                                </Space>
                            </Card>
                        ))}

                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button onClick={handleAddMaterial} block>
                                Adicionar outro material
                            </Button>

                            <Button type="primary" onClick={handleSubmitMaterials} block>
                                Salvar materiais
                            </Button>
                        </Space>
                    </Form>
                </Card>
            )}
        </div>
    );
};

export default CreateStudyPlanPage;
