import { useAuthActions } from "@/hooks/useAuth";
import { useCurrentEnterprise } from "@/hooks/useEnterprise";
import { useCurrentManager, useManagers } from "@/hooks/useManager";
import { CloudinaryService } from "@/services/clodinary.service";
import { ForwardRefExoticComponent, RefAttributes, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SettingOption {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  title: string;
  onClick: VoidFunction;
}

import {
  ChefHat,
  CreditCard,
  LucideProps,
  Trophy,
  Users,
  Wallet,
  Archive,
} from "lucide-react";

export function useSettingsScreenController() {
  const navigate = useNavigate();

  const options: SettingOption[] = [
    {
      icon: ChefHat,
      title: "Gerenciar Cardápio",
      onClick: () => navigate("/settings/menu"),
    },
    {
      icon: Wallet,
      title: "Finanças",
      onClick: () => navigate("/settings/finances"),
    },
    {
      icon: CreditCard,
      title: "Mensalidades",
      onClick: () => navigate("/settings/subscriptions"),
    },
    {
      icon: Trophy,
      title: "Começar Incentivo",
      onClick: () => navigate("/settings/incentives"),
    },
    {
      icon: Users,
      title: "Gerentes e Auxiliares",
      onClick: () => navigate("/settings/managers"),
    },
    {
      icon: Archive,
      title: "Arquivados",
      onClick: () => navigate("/settings/archived"),
    },
  ];

  const { data: enterprise } = useCurrentEnterprise();
  const { data: manager, isLoading } = useCurrentManager();

  const { logout } = useAuthActions();
  const { logoutManager, update } = useManagers();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendImage = async (file: any) => {
    const url = await CloudinaryService.sendPicture(file);
    await update.mutateAsync({
      managerId: manager.id,
      payload: { img_perfil: url },
    });
    localStorage.setItem(
      "usuario",
      JSON.stringify({
        ...manager,
        img_perfil: url,
      }),
    );
    toast.success("Recarregue a página para sua foto aparecer!");
  };

  return {
    options,
    navigate,
    isLoading,
    enterprise,
    fileInputRef,
    handleSendImage,
    manager,
    logout,
    logoutManager,
  };
}
