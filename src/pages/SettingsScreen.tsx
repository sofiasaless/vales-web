import { PageHeader } from '@/components/PageHeader';
import { AvatarInitials } from '@/components/AvatarInitials';
import { mockManager } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  ChefHat, Bell, LogOut, ChevronRight, UtensilsCrossed,
  CreditCard, Wallet, Trophy, Users, UserCog,
} from 'lucide-react';

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { manager, logout, logoutManager } = useAuth();

  const MenuItem = ({ icon: Icon, label, onClick, danger = false }: {
    icon: any; label: string; onClick?: () => void; danger?: boolean;
  }) => (
    <button
      onClick={onClick}
      className="tap-highlight-none"
      style={{
        display: 'flex', alignItems: 'center', width: '100%', padding: 16,
        background: 'none', border: 'none', cursor: 'pointer',
        color: danger ? 'var(--color-danger)' : 'var(--color-text)',
        transition: 'background 0.2s',
      }}
    >
      <div style={{
        padding: 8, borderRadius: 8, marginRight: 12,
        background: danger ? 'rgba(217, 54, 54, 0.1)' : 'var(--color-bg-secondary)',
      }}>
        <Icon style={{ width: 20, height: 20, color: danger ? 'var(--color-danger)' : 'var(--color-text-secondary)' }} />
      </div>
      <span style={{ flex: 1, textAlign: 'left', fontWeight: 500 }}>{label}</span>
      <ChevronRight style={{ width: 20, height: 20, color: 'var(--color-text-secondary)' }} />
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <PageHeader title="Configurações" subtitle={mockManager.restaurantName} />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Profile */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <AvatarInitials name={manager?.nome || mockManager.name} size="lg" />
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>{manager?.nome || mockManager.name}</h2>
              <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{mockManager.email}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: 'var(--color-primary)', fontSize: 14 }}>
                {manager?.tipo === 'GERENTE' ? <ChefHat style={{ width: 16, height: 16 }} /> : <UserCog style={{ width: 16, height: 16 }} />}
                <span>{manager?.tipo === 'GERENTE' ? 'Gerente' : 'Auxiliar'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 12, borderRadius: 12, background: 'rgba(45, 184, 164, 0.2)' }}>
              <UtensilsCrossed style={{ width: 24, height: 24, color: 'var(--color-primary)' }} />
            </div>
            <div>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>Restaurante</p>
              <p style={{ fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>{mockManager.restaurantName}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <MenuItem icon={ChefHat} label="Gerenciar Cardápio" onClick={() => navigate('/settings/menu')} />
          <div style={{ height: 1, background: 'var(--color-border)' }} />
          <MenuItem icon={Wallet} label="Finanças" onClick={() => navigate('/settings/finances')} />
          <div style={{ height: 1, background: 'var(--color-border)' }} />
          <MenuItem icon={CreditCard} label="Mensalidades" onClick={() => navigate('/settings/subscriptions')} />
          <div style={{ height: 1, background: 'var(--color-border)' }} />
          <MenuItem icon={Trophy} label="Começar Incentivo" onClick={() => navigate('/settings/incentives')} />
          <div style={{ height: 1, background: 'var(--color-border)' }} />
          <MenuItem icon={Users} label="Gerentes e Auxiliares" onClick={() => navigate('/settings/managers')} />
          <div style={{ height: 1, background: 'var(--color-border)' }} />
          <MenuItem icon={Bell} label="Notificações" onClick={() => {}} />
        </div>

        {/* Logout */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <MenuItem icon={UserCog} label="Trocar Usuário" onClick={() => { logoutManager(); navigate('/select-manager'); }} />
          <div style={{ height: 1, background: 'var(--color-border)' }} />
          <MenuItem icon={LogOut} label="Sair do Restaurante" danger onClick={() => { logout(); navigate('/login'); }} />
        </div>

        <div style={{ textAlign: 'center', paddingTop: 24 }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Vale Restaurante v1.0.0</p>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>Feito com ❤️ para gerentes</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
