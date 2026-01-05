import { useNavigate, useLocation } from 'react-router-dom';
import { Users, UserPlus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Users, label: 'Funcionários' },
  { path: '/new-employee', icon: UserPlus, label: 'Cadastrar' },
  { path: '/settings', icon: Settings, label: 'Configurações' },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on certain screens
  const hiddenPaths = ['/menu/', '/payment/', '/employee/'];
  const shouldHide = hiddenPaths.some((path) => location.pathname.includes(path));

  if (shouldHide) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-40">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full tap-highlight-none transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 mb-1 transition-transform',
                  isActive && 'scale-110'
                )}
              />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
