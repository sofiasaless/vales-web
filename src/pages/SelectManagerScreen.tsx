import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthActions } from "@/hooks/useAuth";
import { useCurrentEnterprise } from "@/hooks/useEnterprise";
import { useListManagers, useManagers } from "@/hooks/useManager";
import { GerenteResponseBody } from "@/types/gerente.type";
import { Loader2, Lock, LogOut, Shield, UserCog, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Radio, Spin, Typography } from "antd";
import { antdTheme } from "@/theme/antTheme";

const { Text } = Typography;

const getTypeIcon = (tipo: GerenteResponseBody["tipo"]) => {
  return tipo === "GERENTE" ? Shield : UserCog;
};

const getTypeLabel = (tipo: GerenteResponseBody["tipo"]) => {
  return tipo === "GERENTE" ? "Gerente" : "Auxiliar";
};

const SelectManagerScreen = () => {
  const navigate = useNavigate();
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [password, setPassword] = useState("");

  const { data: activeManagers, isLoading, isPending } = useListManagers();
  const { autenticate } = useManagers();

  const { logout } = useAuthActions();
  const { data: restaurant } = useCurrentEnterprise();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedManagerId) {
      toast.error("Selecione um usuário");
      return;
    }

    if (!password.trim()) {
      toast.error("Digite a senha");
      return;
    }

    autenticate.mutateAsync({
      body: { id: selectedManagerId, senha: password },
    });
  };

  const handleLogout = () => {
    logout.mutate();
  };

  useEffect(() => {
    if (logout.isPending || autenticate.isPending) return;

    if (logout.isSuccess) navigate("/login");

    if (autenticate.isError) {
      toast.error(`Erro ao autenticar ${autenticate.error}`);
    }

    if (autenticate.data) {
      if (autenticate.data.usuario) {
        toast.success("Login realizado com sucesso!");
        navigate("/");
      } else {
        toast.error(autenticate.data.mensagem);
      }
    }

  }, [
    logout.isPending,
    autenticate.isPending,
    logout.isSuccess,
    autenticate.isSuccess,
    autenticate.isError,
    autenticate.error,
    navigate,
    autenticate.data,
  ]);

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
              <Label>Operadores</Label>
              <Radio.Group
                value={selectedManagerId}
                onChange={(e) => setSelectedManagerId(e.target.value)}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {isLoading || isPending ? (
                  <>
                    <Spin />
                  </>
                ) : (
                  activeManagers?.map((mgr) => {
                    const TypeIcon = getTypeIcon(mgr.tipo);
                    return (
                      <div
                        key={mgr.id}
                        onClick={() => setSelectedManagerId(mgr.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: 12,
                          borderRadius: 8,
                          border: `1px solid ${selectedManagerId === mgr.id ? antdTheme.token.colorPrimary : antdTheme.token.colorBorder}`,
                          background:
                            selectedManagerId === mgr.id
                              ? "rgba(45, 184, 164, 0.05)"
                              : "transparent",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <Radio value={mgr.id} />
                        <div style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontWeight: 500,
                              margin: 0,
                              color: "var(--color-text)",
                            }}
                          >
                            {mgr.nome}
                          </Text>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 2,
                            }}
                          >
                            <TypeIcon
                              style={{
                                width: 12,
                                height: 12,
                                color: "var(--color-text-secondary)",
                              }}
                            />
                            <span
                              style={{
                                fontSize: 12,
                                color: "var(--color-text-secondary)",
                              }}
                            >
                              {getTypeLabel(mgr.tipo)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
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
                  inputMode="decimal"
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
                  "Entrar"
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
