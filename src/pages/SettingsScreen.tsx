import { AvatarInitials } from '@/components/AvatarInitials';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { mockManager } from '@/data/mockData';
import { useAuthActions } from '@/hooks/useAuth';
import { useCurrentEnterprise } from '@/hooks/useEnterprise';
import { useCurrentManager, useManagers } from '@/hooks/useManager';
import {
  Bell,
  ChefHat,
  ChevronRight,
  CreditCard,
  LogOut,
  Trophy,
  UserCog,
  Users,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsScreen = () => {
  const navigate = useNavigate();

  const { data: enterprise } = useCurrentEnterprise()
  const { data: manager } = useCurrentManager()

  const { logout } = useAuthActions()
  const { logoutManager } = useManagers()

  const MenuItem = ({
    icon: Icon,
    label,
    onClick,
    danger = false,
  }: {
    icon: any;
    label: string;
    onClick?: () => void;
    danger?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-4 tap-highlight-none transition-colors ${
        danger ? 'text-danger' : 'text-foreground'
      }`}
    >
      <div
        className={`p-2 rounded-lg mr-3 ${
          danger ? 'bg-danger/10' : 'bg-secondary'
        }`}
      >
        <Icon className={`w-5 h-5 ${danger ? 'text-danger' : 'text-muted-foreground'}`} />
      </div>
      <span className="flex-1 text-left font-medium">{label}</span>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Configurações" subtitle={enterprise?.nome_fantasia} />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Profile Card */}
        <Card className="p-6 glass-card border-border">
          <div className="flex items-center gap-4">
            <AvatarInitials name={manager?.nome || mockManager.name} size="lg" />
            <div>
              <h2 className="text-xl font-bold">{manager?.nome || mockManager.name}</h2>
              <p className="text-muted-foreground">{enterprise?.email}</p>
              <div className="flex items-center gap-1 mt-1 text-primary text-sm">
                {manager?.tipo === 'GERENTE' ? (
                  <ChefHat className="w-4 h-4" />
                ) : (
                  <UserCog className="w-4 h-4" />
                )}
                <span>{manager?.tipo === 'GERENTE' ? 'Gerente' : 'Auxiliar'}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Restaurant Info */}
        <Card className="p-4 glass-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20">
              <UtensilsCrossed className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Restaurante</p>
              <p className="font-semibold">{enterprise?.nome_fantasia}</p>
            </div>
          </div>
        </Card>

        {/* Menu */}
        <Card className="glass-card border-border overflow-hidden divide-y divide-border">
          <MenuItem
            icon={ChefHat}
            label="Gerenciar Cardápio"
            onClick={() => navigate('/settings/menu')}
          />
          <MenuItem
            icon={Wallet}
            label="Finanças"
            onClick={() => navigate('/settings/finances')}
          />
          <MenuItem
            icon={CreditCard}
            label="Mensalidades"
            onClick={() => navigate('/settings/subscriptions')}
          />
          <MenuItem
            icon={Trophy}
            label="Começar Incentivo"
            onClick={() => navigate('/settings/incentives')}
          />
          <MenuItem
            icon={Users}
            label="Gerentes e Auxiliares"
            onClick={() => navigate('/settings/managers')}
          />
          <MenuItem
            icon={Bell}
            label="Notificações"
            onClick={() => {}}
          />
        </Card>

        {/* Logout Options */}
        <Card className="glass-card border-border overflow-hidden divide-y divide-border">
          <MenuItem
            icon={UserCog}
            label="Trocar Usuário"
            onClick={async () => {
              await logoutManager.mutateAsync()
              navigate('/select-manager');
            }}
          />
          <MenuItem
            icon={LogOut}
            label="Sair do Restaurante"
            danger
            onClick={async () => {
              await logout.mutateAsync()
              navigate('/login');
            }}
          />
        </Card>

        {/* App Info */}
        <div className="text-center pt-6">
          <p className="text-xs text-muted-foreground">
            Vales Web v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
