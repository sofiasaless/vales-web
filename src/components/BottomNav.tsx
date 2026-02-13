import { useNavigate, useLocation } from 'react-router-dom';
import { Users, UserPlus, Settings } from 'lucide-react';

const navItems = [
  { path: '/', icon: Users, label: 'Funcionários' },
  { path: '/new-employee', icon: UserPlus, label: 'Cadastrar' },
  { path: '/settings', icon: Settings, label: 'Configurações' },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hiddenPaths = ['/menu/', '/payment/', '/employee/', '/login', '/select-manager'];
  const shouldHide = hiddenPaths.some((path) => location.pathname.includes(path));

  if (shouldHide) return null;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--color-bg-card)',
      borderTop: '1px solid var(--color-border)',
      zIndex: 40,
      paddingBottom: 'env(safe-area-inset-bottom, 16px)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 64,
        maxWidth: 512,
        margin: '0 auto',
      }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="tap-highlight-none"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                height: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                transition: 'color 0.2s',
                position: 'relative',
              }}
            >
              <Icon
                style={{
                  width: 20,
                  height: 20,
                  marginBottom: 4,
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s',
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 500 }}>{item.label}</span>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  width: 48,
                  height: 2,
                  background: 'var(--color-primary)',
                  borderRadius: '2px 2px 0 0',
                }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
