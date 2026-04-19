import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: ReactNode;
  className?: string;
  goBackToOption?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  showBack = false,
  rightAction,
  className,
  goBackToOption,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3",
        className,
      )}
    >
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => {
                if (!goBackToOption) navigate(-1);
                else navigate(goBackToOption);
              }}
              className="p-2 -ml-2 rounded-full hover:bg-secondary tap-highlight-none transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
};
