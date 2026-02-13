import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuthActions } from '@/hooks/useAuth';
import { useCurrentEnterprise } from '@/hooks/useEnterprise';
import { useListManagers, useManagers } from '@/hooks/useManager';
import { GerenteResponseBody } from '@/types/gerente.type';
import { Loader2, Lock, LogOut, Shield, UserCog, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

  const { data: activeManagers } = useListManagers()
  const { autenticate } = useManagers()

  const { logout } = useAuthActions()
  const { data: restaurant } = useCurrentEnterprise()

  const [isLoading] = useState(autenticate.isPending);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedManagerId) {
      toast.error('Selecione um usuário');
      return;
    }

    if (!password.trim()) {
      toast.error('Digite a senha');
      return;
    }

    autenticate.mutate({
      body: { id: selectedManagerId, senha: password }
    })

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
    }
  }, [logout.isPending, autenticate.isPending])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Selecione seu usuário</CardTitle>
            <CardDescription className="mt-2">
              {restaurant?.nome_fantasia}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Usuário</Label>
              <RadioGroup
                value={selectedManagerId}
                onValueChange={(v) => {
                  setSelectedManagerId(v)
                }}
                className="space-y-2"
              >
                {activeManagers?.map((manager) => {
                  const TypeIcon = getTypeIcon(manager.tipo);
                  return (
                    <div
                      key={manager.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${selectedManagerId === manager.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedManagerId(manager.id)}
                    >
                      <RadioGroupItem value={manager.id} id={manager.id} />
                      <div className="flex-1">
                        <Label
                          htmlFor={manager.id}
                          className="cursor-pointer font-medium"
                        >
                          {manager.nome}
                        </Label>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <TypeIcon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {getTypeLabel(manager.tipo)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>

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
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !selectedManagerId}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Voltar para login do restaurante
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectManagerScreen;
