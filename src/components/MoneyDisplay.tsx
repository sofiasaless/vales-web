interface MoneyDisplayProps {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'positive' | 'negative';
  showSign?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 30,
};

const variantColors = {
  default: 'var(--color-text)',
  positive: 'var(--color-success)',
  negative: 'var(--color-danger)',
};

export const MoneyDisplay = ({
  value,
  size = 'md',
  variant = 'default',
  showSign = false,
  className,
  style,
}: MoneyDisplayProps) => {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Math.abs(value));

  const sign = value < 0 ? '- ' : showSign && value > 0 ? '+ ' : '';

  return (
    <span
      className={`money-display ${className || ''}`}
      style={{
        fontSize: sizeMap[size],
        color: variantColors[variant],
        fontWeight: 500,
        letterSpacing: '-0.02em',
        ...style,
      }}
    >
      {sign}{formattedValue}
    </span>
  );
};
