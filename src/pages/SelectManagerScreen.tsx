import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthActions } from '@/hooks/useAuth';
import { useCurrentEnterprise } from '@/hooks/useEnterprise';
import { useListManagers, useManagers } from '@/hooks/useManager';
import { GerenteResponseBody } from '@/types/gerente.type';
import { Loader2, Lock, LogOut, Shield, UserCog, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Radio, Typography } from 'antd'
import { antdTheme } from '@/theme/antTheme';

const { Text } = Typography

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
      toast.success('Login realizado com sucesso!')
      navigate('/')
      return
    }

    if (autenticate.isError) {
      toast.error(`Erro ao autenticar ${autenticate.error}`)
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

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Operadores</Label>
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
                      border: `1px solid ${selectedManagerId === mgr.id ? antdTheme.token.colorPrimary : antdTheme.token.colorBorder}`,
                      background: selectedManagerId === mgr.id ? 'rgba(45, 184, 164, 0.05)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Radio value={mgr.id} />
                    <div style={{ flex: 1 }}>
                      <Text style={{ fontWeight: 500, margin: 0, color: 'var(--color-text)' }}>{mgr.nome}</Text>
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
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum usuário ativo encontrado
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={autenticate.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={autenticate.isPending || !selectedManagerId}
              >
                {autenticate.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>

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
