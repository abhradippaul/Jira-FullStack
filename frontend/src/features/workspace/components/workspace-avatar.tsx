import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  image?: string | null;
  name: string;
  className?: string | null;
}

function WorkspaceAvatar({ name, className, image }: WorkspaceAvatarProps) {
  if (image) {
    return (
      <div
        className={cn("size-10 relative rounded-md overflow-hidden", className)}
      >
        <img src={image} alt={name} className="size-full object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-10 rounded-md", className)}>
      <AvatarFallback className="text-white uppercase bg-blue-600 text-lg font-semibold rounded-md">
        {name[0]}{" "}
      </AvatarFallback>
    </Avatar>
  );
}

export default WorkspaceAvatar;
