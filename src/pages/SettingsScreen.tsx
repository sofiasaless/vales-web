import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { AvatarInitials } from '@/components/AvatarInitials';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockManager } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat,
  Bell,
  LogOut,
  ChevronRight,
  UtensilsCrossed,
  CreditCard,
  Copy,
  Check,
  Calendar,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Subscription {
  id: string;
  name: string;
  dueDay: number;
  price: number;
  pixKey: string;
  status: 'active' | 'pending' | 'overdue';
}

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Plano Básico',
    dueDay: 10,
    price: 49.90,
    pixKey: 'vale-restaurante@pagamentos.com.br',
    status: 'active',
  },
  {
    id: 'sub-2',
    name: 'Módulo Relatórios',
    dueDay: 15,
    price: 29.90,
    pixKey: '12345678901234567890123456789012345',
    status: 'pending',
  },
];

const SettingsScreen = () => {
  const navigate = useNavigate();
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyPix = async (pixKey: string) => {
    await navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success('Chave PIX copiada!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'overdue':
        return 'text-danger bg-danger/10';
    }
  };

  const getStatusLabel = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return 'Em dia';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Atrasado';
    }
  };

  const getNextDueDate = (dueDay: number) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let dueDate = new Date(currentYear, currentMonth, dueDay);
    if (dueDate < today) {
      dueDate = new Date(currentYear, currentMonth + 1, dueDay);
    }
    
    return dueDate.toLocaleDateString('pt-BR');
  };

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
      <PageHeader title="Configurações" subtitle={mockManager.restaurantName} />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Profile Card */}
        <Card className="p-6 glass-card border-border">
          <div className="flex items-center gap-4">
            <AvatarInitials name={mockManager.name} size="lg" />
            <div>
              <h2 className="text-xl font-bold">{mockManager.name}</h2>
              <p className="text-muted-foreground">{mockManager.email}</p>
              <div className="flex items-center gap-1 mt-1 text-primary text-sm">
                <ChefHat className="w-4 h-4" />
                <span>Gerente</span>
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
              <p className="font-semibold">{mockManager.restaurantName}</p>
            </div>
          </div>
        </Card>

        {/* Subscriptions Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground px-1 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Mensalidades
          </h3>
          <div className="space-y-2">
            {mockSubscriptions.map((subscription) => (
              <Card
                key={subscription.id}
                className="p-4 glass-card border-border cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => setSelectedSubscription(subscription)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{subscription.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Vence dia {subscription.dueDay} • R$ {subscription.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(subscription.status)}`}>
                      {getStatusLabel(subscription.status)}
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Menu */}
        <Card className="glass-card border-border overflow-hidden divide-y divide-border">
          <MenuItem
            icon={ChefHat}
            label="Gerenciar Cardápio"
            onClick={() => navigate('/settings/menu')}
          />
          <MenuItem
            icon={Bell}
            label="Notificações"
            onClick={() => {}}
          />
        </Card>

        {/* Logout */}
        <Card className="glass-card border-border overflow-hidden">
          <MenuItem
            icon={LogOut}
            label="Sair"
            danger
            onClick={() => {}}
          />
        </Card>

        {/* App Info */}
        <div className="text-center pt-6">
          <p className="text-xs text-muted-foreground">
            Vale Restaurante v1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Feito com ❤️ para gerentes
          </p>
        </div>
      </div>

      {/* Subscription Modal */}
      <Dialog open={!!selectedSubscription} onOpenChange={() => setSelectedSubscription(null)}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>{selectedSubscription?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedSubscription && (
            <div className="space-y-4">
              {/* Due Date Info */}
              <Card className="p-4 bg-secondary/50 border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Próximo vencimento</p>
                    <p className="font-semibold">{getNextDueDate(selectedSubscription.dueDay)}</p>
                  </div>
                </div>
              </Card>

              {/* Price */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                <span className="text-muted-foreground">Valor</span>
                <span className="text-xl font-bold text-primary">
                  R$ {selectedSubscription.price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                <span className="text-muted-foreground">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSubscription.status)}`}>
                  {getStatusLabel(selectedSubscription.status)}
                </span>
              </div>

              {/* PIX Key */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Chave PIX para pagamento
                </label>
                <div className="relative">
                  <Textarea
                    value={selectedSubscription.pixKey}
                    readOnly
                    className="pr-12 resize-none bg-secondary/50 border-border font-mono text-sm"
                    rows={2}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2"
                    onClick={() => handleCopyPix(selectedSubscription.pixKey)}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Clique no botão para copiar a chave PIX
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsScreen;
