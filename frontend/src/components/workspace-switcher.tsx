import { useGetWorkspaces } from "@/custom-hooks/workspace/use-workspace";
import type { GetWorkspaces } from "@/lib/types";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WorkspaceAvatar from "@/features/workspace/components/workspace-avatar";
import { useLocation, useRouter } from "@tanstack/react-router";

function WorkspaceSwitcher() {
  const router = useRouter();
  const location = useLocation();
  const pathname = location.pathname.split("/")?.[2];
  const { data, isLoading } = useGetWorkspaces();
  const workspaces =
    (data?.data.workspaces as GetWorkspaces[]) || null || undefined;

  const onSelect = (id: string) => {
    router.navigate({
      to: `/workspaces/${id}`,
    });
  };

  const onCreateWorkspaceClick = () => {
    router.navigate({
      to: location.pathname,
      search: {
        workspaceModal: "open",
      },
    });
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">workspaces</p>
        <RiAddCircleFill
          onClick={onCreateWorkspaceClick}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      <Select onValueChange={onSelect} disabled={isLoading} value={pathname}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.map(({ id, image_url, name }) => (
            <SelectItem key={id} value={id}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <WorkspaceAvatar name={name} image={image_url} className="" />
                <span className="truncate">{name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default WorkspaceSwitcher;
