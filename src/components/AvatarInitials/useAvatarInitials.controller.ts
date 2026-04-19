export function useAvatarInitialsController() {
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-lg",
    lg: "w-20 h-20 text-2xl",
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(" ");
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
    "bg-primary/20 text-primary",
    "bg-success/20 text-success",
    "bg-warning/20 text-warning",
    "bg-accent/30 text-accent-foreground",
    "bg-secondary text-secondary-foreground",
  ];

  const getSize = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "lg":
        return { width: 80, height: 80 };
      case "md":
        return { width: 55, height: 55 };
      case "sm":
        return { width: 30, height: 30 };
      default:
        return { width: 50, height: 50 };
    }
  };

  return {
    sizeClasses,
    getInitials,
    getColorIndex,
    colorClasses,
    getSize,
  };
}
