import { cn } from '@/lib/utils';

interface AvatarInitialsProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-14 h-14 text-lg',
  lg: 'w-20 h-20 text-2xl',
};

export const AvatarInitials = ({ name, size = 'md', className }: AvatarInitialsProps) => {
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate consistent color based on name
  const getColorIndex = (name: string): number => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 5;
  };

  const colorClasses = [
    'bg-primary/20 text-primary',
    'bg-success/20 text-success',
    'bg-warning/20 text-warning',
    'bg-accent/30 text-accent-foreground',
    'bg-secondary text-secondary-foreground',
  ];

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold',
        sizeClasses[size],
        colorClasses[getColorIndex(name)],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};
