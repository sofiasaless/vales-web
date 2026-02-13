import { Button, Card, Input, Radio, App } from 'antd';
import { useAuthActions } from '@/hooks/useAuth';
import { useCurrentEnterprise } from '@/hooks/useEnterprise';
import { useListManagers, useManagers } from '@/hooks/useManager';
import { GerenteResponseBody } from '@/types/gerente.type';
import { Loader2, Lock, LogOut, Shield, UserCog, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getTypeIcon = (tipo: GerenteResponseBody['tipo']) => {
  return tipo === 'GERENTE' ? Shield : UserCog;
};

const getTypeLabel = (tipo: GerenteResponseBody['tipo']) => {
  return tipo === 'GERENTE' ? 'Gerente' : 'Auxiliar';
};

const SelectManagerScreen = () => {
  const navigate = useNavigate();
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const [password, setPassword] = useState('');
  const { message } = App.useApp();

  const { data: activeManagers } = useListManagers();
  const { autenticate } = useManagers();
  const { logout } = useAuthActions();
  const { data: restaurant } = useCurrentEnterprise();

  const isLoading = autenticate.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManagerId) {
      message.error('Selecione um usuário');
      return;
    }
    if (!password.trim()) {
      message.error('Digite a senha');
      return;
    }
    autenticate.mutate({ body: { id: selectedManagerId, senha: password } });
  };

  const handleLogout = () => {
    logout.mutate();
  };

  useEffect(() => {
    if (logout.isPending || autenticate.isPending) return;
    if (logout.isSuccess) navigate('/login');
    if (autenticate.isSuccess) {
      message.success('Login realizado com sucesso!');
      navigate('/');
    }
  }, [logout.isPending, autenticate.isPending]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Card style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(45, 184, 164, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Users style={{ width: 32, height: 32, color: 'var(--color-primary)' }} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>Selecione seu usuário</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>
            {restaurant?.nome_fantasia}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: 'var(--color-text)' }}>Usuário</label>
            <Radio.Group
              value={selectedManagerId}
              onChange={(e) => setSelectedManagerId(e.target.value)}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {activeManagers?.map((mgr) => {
                const TypeIcon = getTypeIcon(mgr.tipo);
                return (
                  <div
                    key={mgr.id}
                    onClick={() => setSelectedManagerId(mgr.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      borderRadius: 8,
                      border: `1px solid ${selectedManagerId === mgr.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: selectedManagerId === mgr.id ? 'rgba(45, 184, 164, 0.05)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Radio value={mgr.id} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 500, margin: 0, color: 'var(--color-text)' }}>{mgr.nome}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <TypeIcon style={{ width: 12, height: 12, color: 'var(--color-text-secondary)' }} />
                        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{getTypeLabel(mgr.tipo)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Radio.Group>

            {activeManagers?.length === 0 && (
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', textAlign: 'center', padding: '16px 0' }}>
                Nenhum usuário ativo encontrado
              </p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: 'var(--color-text)' }}>Senha</label>
            <Input.Password
              prefix={<Lock style={{ width: 16, height: 16, color: 'var(--color-text-secondary)' }} />}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              size="large"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={isLoading} disabled={!selectedManagerId}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            <Button type="text" block icon={<LogOut style={{ width: 16, height: 16 }} />} onClick={handleLogout}>
              Voltar para login do restaurante
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SelectManagerScreen;
