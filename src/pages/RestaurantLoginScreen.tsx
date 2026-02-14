import { Button, Card, Input, App } from 'antd';
import { useAuthActions } from '@/hooks/useAuth';
import { Loader2, Lock, Mail, Store } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantLoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { message } = App.useApp();

  const { login } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      message.error('Preencha todos os campos');
      return;
    }
    login.mutate({ email, password });
  };

  const isLoading = login.isPending;

  useEffect(() => {
    if (login.isPending) return;
    if (login.isSuccess) {
      message.success('Login realizado com sucesso!');
      navigate('/select-manager');
    }
    if (login.isError) {
      message.error(`Erro ao fazer login: ${login.error.message}`);
    }
  }, [login.isPending]);

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
            <Store style={{ width: 32, height: 32, color: 'var(--color-primary)' }} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>Bem-vindo</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>
            Entre com as credenciais do seu restaurante
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: 'var(--color-text)' }}>Email</label>
            <Input
              prefix={<Mail style={{ width: 16, height: 16, color: 'var(--color-text-secondary)' }} />}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              size="large"
            />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={login.isPending}
                />
              </div>
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
                  disabled={login.isPending}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantLoginScreen;
