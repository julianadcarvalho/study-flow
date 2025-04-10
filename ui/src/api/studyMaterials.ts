import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;
export interface StudyMaterial {
    id: number;
    title: string;
    description?: string;
    type: 'video' | 'article' | 'pdf' | 'book';
    link: string;
    status: 'unread' | 'read';
    planoId?: number;
  }

export const getStudyMaterials = async (): Promise<StudyMaterial[]> => {
  const response = await axios.get(`${API_URL}/study-materials`);
  return response.data;
};

export const createStudyMaterial = async ({
    planoId,
    tipo,
    titulo,
    url,
  }: {
    planoId: number;
    tipo: 'vídeo' | 'artigo' | 'pdf' | 'livro';
    titulo: string;
    url: string;
  }) => {
    const response = await axios.post(`${API_URL}/study-materials`, {
      planoId,
      tipo,
      titulo,
      url,
      status: 'pendente',
    });
    return response.data;
  };
  

export const deleteStudyMaterial = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/study-materials/${id}`);
};

export const updateMaterialStatus = async (
  id: number,
  status: 'pendente' | 'concluído'
): Promise<void> => {
  await axios.patch(`${API_URL}/study-materials/${id}`, { status });
};


export const updateStudyMaterial = async (
  id: number,
  payload: {
    title?: string;
    description?: string;
    status?: 'pendente' | 'concluído';
    type?: 'video' | 'article' | 'pdf' | 'book';
    link?: string;
  }
) => {
  const response = await axios.patch(`${API_URL}/study-materials/${id}`, payload);
  return response.data;
};

