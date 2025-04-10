import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export interface StudyPlanPayload {
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status?: 'pending' | 'in_progress' | 'completed';
}

export const createStudyPlan = async ({
  name,
  description,
  start_date,
  end_date,
  user_id = 1,
}: {
  name: string;
  description?: string;
  start_date: string;
  end_date?: string | null;
  user_id?: number;
}) => {
  const response = await api.post('/study-plans', {
    name,
    user_id,
    description,
    start_date,
    end_date,
    status: 'pending',
  });
  return response.data;
};

export const getStudyPlans = async () => {
  const response = await api.get('/study-plans');
  return response.data;
};

export const deleteStudyPlan = async (id: number) => {
  const response = await api.delete(`/study-plans/${id}`);
  return response.data;
};

export const updateStudyPlanStatus = async (
  id: number,
  status: 'pending' | 'in_progress' | 'completed'
) => {
  const response = await api.patch(`/study-plans/${id}`, { status });
  return response.data;
};

export const updateStudyPlan = async (
  id: number,
  payload: {
    name?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    status?: 'pending' | 'in_progress' | 'completed';
  }
) => {
  const response = await api.patch(`/study-plans/${id}`, payload);
  return response.data;
};
