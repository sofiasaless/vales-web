import { cn } from '@/lib/utils';

interface MoneyDisplayProps {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'positive' | 'negative';
  showSign?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl',
};

const variantClasses = {
  default: 'text-foreground',
  positive: 'text-success',
  negative: 'text-danger',
};

export const MoneyDisplay = ({
  value,
  size = 'md',
  variant = 'default',
  showSign = false,
  className,
}: MoneyDisplayProps) => {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Math.abs(value));

  const sign = value < 0 ? '- ' : showSign && value > 0 ? '+ ' : '';

  return (
    <span
      className={cn(
        'font-mono font-medium tracking-tight',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {sign}{formattedValue}
    </span>
  );
};
