import { useGetProjects } from "@/custom-hooks/project/use-project";
import ProjectAvatar from "@/features/project/components/project-avatar";
import type { GetProjects } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Link,
  useLocation,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { RiAddCircleFill } from "react-icons/ri";

function Projects() {
  const { pathname } = useLocation();
  const { workspaceId } = useParams({ strict: false });
  const { data, isLoading, isError } = useGetProjects(workspaceId || "");
  const router = useRouter();

  if (isLoading || isError) return null;

  const projects = data?.data as GetProjects | null | undefined;

  const onCreateProjectClick = () => {
    router.navigate({
      to: location.pathname,
      search: {
        projectModal: "open",
      },
    });
  };

  return (
    <div className="flex flex-col gap-y-1 my-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">projects</p>
        <RiAddCircleFill
          onClick={onCreateProjectClick}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {projects?.projects?.map(({ id, image_url, name }) => {
        const href = `/workspaces/${workspaceId}/projects/${id}`;
        const isActive = pathname === href;
        return (
          <Link to={href} key={id}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500 hover:bg-white hover:text-black",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <ProjectAvatar name={name} image={image_url} />
              <span className="truncate">{name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Projects;
