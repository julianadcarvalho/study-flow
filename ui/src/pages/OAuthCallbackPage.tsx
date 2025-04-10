import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const OAuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/home');
    } else {
      navigate('/');
    }
  }, [navigate]);

  return <p>Redirecionando...</p>;
};
