import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: ReactNode;
}

export const PageHeader = ({ title, subtitle, showBack = false, rightAction }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'rgba(17, 24, 39, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--color-border)',
      padding: '12px 16px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 512,
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="tap-highlight-none"
              style={{
                padding: 8,
                marginLeft: -8,
                borderRadius: '50%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowLeft style={{ width: 20, height: 20 }} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
};
