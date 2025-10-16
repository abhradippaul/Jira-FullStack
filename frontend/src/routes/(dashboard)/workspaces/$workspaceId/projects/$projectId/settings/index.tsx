import { useGetProject } from "@/custom-hooks/project/use-project";
import EditProjectForm from "@/features/project/components/edit-project-form";
import type { GetSingleProject } from "@/lib/types";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(dashboard)/workspaces/$workspaceId/projects/$projectId/settings/"
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
  const { workspaceId, projectId } = Route.useParams();

  const { data, isLoading, error } = useGetProject(workspaceId, projectId);

  console.log(data);

  if (error || isLoading) {
    return null;
  }
  const project = data?.data.project as GetSingleProject | null | undefined;

  if (!project) {
    return null;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm project={project} workspaceId={workspaceId} />
    </div>
  );
}
