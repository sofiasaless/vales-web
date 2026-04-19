import { cn } from "@/lib/utils";
import { Avatar } from "antd";
import { useAvatarInitialsController } from "./useAvatarInitials.controller";

interface AvatarInitialsProps {
  name: string;
  photoUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const AvatarInitials = ({
  name,
  size = "md",
  className,
  photoUrl,
}: AvatarInitialsProps) => {
  const { sizeClasses, getInitials, getColorIndex, colorClasses, getSize } =
    useAvatarInitialsController();

  return photoUrl ? (
    <Avatar
      className="my-2"
      style={getSize(size)}
      size={"large"}
      src={photoUrl}
    />
  ) : (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold",
        sizeClasses[size],
        colorClasses[getColorIndex(name)],
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
};
