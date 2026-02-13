interface AvatarInitialsProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

const sizeDimensions = {
  sm: { wh: 40, font: 14 },
  md: { wh: 56, font: 18 },
  lg: { wh: 80, font: 24 },
};

const colorPairs = [
  { bg: 'rgba(45, 184, 164, 0.2)', text: '#2db8a4' },
  { bg: 'rgba(45, 184, 106, 0.2)', text: '#2db86a' },
  { bg: 'rgba(242, 166, 13, 0.2)', text: '#f2a60d' },
  { bg: 'rgba(45, 184, 164, 0.3)', text: '#f0f4f8' },
  { bg: 'rgba(39, 44, 54, 1)', text: '#7a8494' },
];

export const AvatarInitials = ({ name, size = 'md', style }: AvatarInitialsProps) => {
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getColorIndex = (name: string): number => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 5;
  };

  const dim = sizeDimensions[size];
  const colors = colorPairs[getColorIndex(name)];

  return (
    <div
      style={{
        width: dim.wh,
        height: dim.wh,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: dim.font,
        background: colors.bg,
        color: colors.text,
        flexShrink: 0,
        ...style,
      }}
    >
      {getInitials(name)}
    </div>
  );
};
