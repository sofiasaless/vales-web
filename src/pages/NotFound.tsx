import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from 'antd';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: 16, fontSize: 48, fontWeight: 700 }}>404</h1>
        <p style={{ marginBottom: 16, fontSize: 20, color: 'var(--color-text-secondary)' }}>Oops! Página não encontrada</p>
        <Button type="link" href="/">Voltar para o início</Button>
      </div>
    </div>
  );
};

export default NotFound;
