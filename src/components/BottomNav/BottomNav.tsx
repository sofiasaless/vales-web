import { cn } from "@/lib/utils";
import { useBottomNavController } from "./useBottomNav.controller";

export const BottomNav = () => {
  const { navigate, navItems, shouldHide, location } = useBottomNavController();

  if (shouldHide) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-40">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full tap-highlight-none transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 mb-1 transition-transform",
                  isActive && "scale-110",
                )}
              />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
