import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProjectAvatarProps {
  image?: string | null;
  name: string;
  className?: string | null;
  fallbackClassName?: string;
}

function ProjectAvatar({
  name,
  className,
  image,
  fallbackClassName,
}: ProjectAvatarProps) {
  if (image) {
    return (
      <div
        className={cn("size-5 relative rounded-md overflow-hidden", className)}
      >
        <img src={image} alt={name} className="size-full object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-5 rounded-md", className)}>
      <AvatarFallback
        className={cn(
          "text-white uppercase bg-blue-600 text-sm font-semibold rounded-md",
          fallbackClassName
        )}
      >
        {name[0]}{" "}
      </AvatarFallback>
    </Avatar>
  );
}

export default ProjectAvatar;
