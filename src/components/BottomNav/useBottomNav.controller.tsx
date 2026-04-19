import { useNavigate, useLocation } from "react-router-dom";
import { Users, UserPlus, Settings } from "lucide-react";

export function useBottomNavController() {
  const navItems = [
    { path: "/", icon: Users, label: "Funcionários" },
    { path: "/new-employee", icon: UserPlus, label: "Cadastrar" },
    { path: "/settings", icon: Settings, label: "Configurações" },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  // Hide on certain screens (including auth screens)
  const hiddenPaths = [
    "/menu/",
    "/payment",
    "/employee/",
    "/login",
    "/select-manager",
    "/contract-employee",
    "/contract-signature",
    "/settings/",
    "/alert/invoice",
  ];
  const shouldHide = hiddenPaths.some((path) =>
    location.pathname.includes(path),
  );

  return {
    navigate,
    navItems,
    hiddenPaths,
    shouldHide,
    location,
  };
}
