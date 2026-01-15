import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, UserCog, MoreVertical, Pencil, Trash2, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Gerente, TiposGerente } from '@/types/manager';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const mockGerentes: Gerente[] = [
  {
    id: 'ger-1',
    nome: 'Carlos Oliveira',
    tipo: 'GERENTE',
    senha: '******',
    restaurante_ref: 'rest-1',
    ativo: true,
    data_ultimo_acesso: new Date('2024-01-10'),
    data_criacao: new Date('2022-01-15'),
  },
  {
    id: 'ger-2',
    nome: 'Fernanda Costa',
    tipo: 'AUXILIAR',
    senha: '******',
    restaurante_ref: 'rest-1',
    ativo: true,
    data_ultimo_acesso: new Date('2024-01-12'),
    data_criacao: new Date('2023-06-20'),
  },
  {
    id: 'ger-3',
    nome: 'Roberto Lima',
    tipo: 'AUXILIAR',
    senha: '******',
    restaurante_ref: 'rest-1',
    ativo: false,
    data_criacao: new Date('2023-09-10'),
  },
];

const ManagersScreen = () => {
  const navigate = useNavigate();
  const [gerentes, setGerentes] = useState<Gerente[]>(mockGerentes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGerente, setSelectedGerente] = useState<Gerente | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'AUXILIAR' as TiposGerente,
    senha: '',
    confirmarSenha: '',
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: 'AUXILIAR',
      senha: '',
      confirmarSenha: '',
    });
    setSelectedGerente(null);
    setIsEditing(false);
  };

  const handleOpenDialog = (gerente?: Gerente) => {
    if (gerente) {
      setSelectedGerente(gerente);
      setIsEditing(true);
      setFormData({
        nome: gerente.nome,
        tipo: gerente.tipo,
        senha: '',
        confirmarSenha: '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (!isEditing && !formData.senha) {
      toast.error('Senha é obrigatória');
      return;
    }

    if (formData.senha && formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (formData.senha && formData.senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (isEditing && selectedGerente) {
      setGerentes(prev =>
        prev.map(g =>
          g.id === selectedGerente.id
            ? {
                ...g,
                nome: formData.nome,
                tipo: formData.tipo,
                ...(formData.senha && { senha: formData.senha }),
              }
            : g
        )
      );
      toast.success('Usuário atualizado com sucesso!');
    } else {
      const newGerente: Gerente = {
        id: `ger-${Date.now()}`,
        nome: formData.nome,
        tipo: formData.tipo,
        senha: formData.senha,
        restaurante_ref: 'rest-1',
        ativo: true,
        data_criacao: new Date(),
      };
      setGerentes(prev => [...prev, newGerente]);
      toast.success('Usuário cadastrado com sucesso!');
    }

    handleCloseDialog();
  };

  const handleToggleAtivo = (gerente: Gerente) => {
    setGerentes(prev =>
      prev.map(g =>
        g.id === gerente.id ? { ...g, ativo: !g.ativo } : g
      )
    );
    toast.success(
      gerente.ativo ? 'Usuário desativado' : 'Usuário ativado'
    );
  };

  const handleDeleteConfirm = () => {
    if (selectedGerente) {
      setGerentes(prev => prev.filter(g => g.id !== selectedGerente.id));
      toast.success('Usuário excluído com sucesso!');
      setSelectedGerente(null);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteClick = (gerente: Gerente) => {
    setSelectedGerente(gerente);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Gerentes e Auxiliares
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os usuários do sistema
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Add Button */}
        <Button
          onClick={() => handleOpenDialog()}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Cadastrar Novo Usuário
        </Button>

        {/* Users List */}
        <div className="space-y-3">
          {gerentes.map(gerente => (
            <Card
              key={gerente.id}
              className={`${!gerente.ativo ? 'opacity-60' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCog className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {gerente.nome}
                        </span>
                        <Badge
                          variant={gerente.tipo === 'GERENTE' ? 'default' : 'secondary'}
                        >
                          {gerente.tipo}
                        </Badge>
                        {!gerente.ativo && (
                          <Badge variant="outline" className="text-muted-foreground">
                            Inativo
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Criado em {format(gerente.data_criacao, "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                      {gerente.data_ultimo_acesso && (
                        <p className="text-xs text-muted-foreground">
                          Último acesso: {format(gerente.data_ultimo_acesso, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenDialog(gerente)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleAtivo(gerente)}>
                        <Power className="h-4 w-4 mr-2" />
                        {gerente.ativo ? 'Desativar' : 'Ativar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(gerente)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}

          {gerentes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <UserCog className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum usuário cadastrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                placeholder="Nome do usuário"
                value={formData.nome}
                onChange={e =>
                  setFormData(prev => ({ ...prev, nome: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: TiposGerente) =>
                  setFormData(prev => ({ ...prev, tipo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GERENTE">Gerente</SelectItem>
                  <SelectItem value="AUXILIAR">Auxiliar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">
                {isEditing ? 'Nova Senha (deixe vazio para manter)' : 'Senha'}
              </Label>
              <Input
                id="senha"
                type="password"
                placeholder="******"
                value={formData.senha}
                onChange={e =>
                  setFormData(prev => ({ ...prev, senha: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
              <Input
                id="confirmarSenha"
                type="password"
                placeholder="******"
                value={formData.confirmarSenha}
                onChange={e =>
                  setFormData(prev => ({ ...prev, confirmarSenha: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? 'Salvar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário "{selectedGerente?.nome}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManagersScreen;
