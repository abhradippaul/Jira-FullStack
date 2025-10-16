import { Button } from "@/components/ui/button";
import { useGetProject } from "@/custom-hooks/project/use-project";
import ErrorPage from "@/error";
import ProjectAvatar from "@/features/project/components/project-avatar";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import type { GetProject } from "@/lib/types";
import LoadingPage from "@/loading";
import {
  createFileRoute,
  Link,
  redirect,
  useParams,
} from "@tanstack/react-router";
import { PencilIcon } from "lucide-react";

export const Route = createFileRoute(
  "/(dashboard)/workspaces/$workspaceId/projects/$projectId/"
)({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      if (!document.cookie) {
        throw redirect({ to: "/auth/sign-in" });
      }
      const isCookieExists = document.cookie
        .split(";")
        .filter((c) => c.includes("isAuthenticated"));
      if (!isCookieExists) {
        throw redirect({ to: "/auth/sign-in" });
      }
      if (!isCookieExists[0].split("=")[1]) {
        throw redirect({ to: "/auth/sign-in" });
      }
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId, workspaceId } = useParams({ strict: false });
  const { data, isLoading, isError } = useGetProject(
    workspaceId || "",
    projectId || ""
  );

  if (isLoading) return <LoadingPage />;

  if (isError) return <ErrorPage />;

  const project = data?.data as GetProject | null | undefined;
  const settingsUrl = `/workspaces/${workspaceId}/projects/${projectId}/settings`;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project?.project?.name || ""}
            image={project?.project?.image_url}
            className="size-8"
          />
          <p className="text-lg font-semibold">
            {project?.project?.name || ""}
          </p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link to={settingsUrl}>
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher />
    </div>
  );
}
