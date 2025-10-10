import { useGetWorkspace } from "@/custom-hooks/workspace/use-workspace";
import EditWorkspaceForm from "@/features/workspace/components/edit-workspace-form";
import type { GetSingleWorkspace } from "@/lib/types";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(dashboard)/workspaces/$workspaceId/settings/"
)({
  beforeLoad: () => {
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
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { workspaceId } = Route.useParams();

  const { data, isLoading, error } = useGetWorkspace(workspaceId);

  if (error || isLoading) {
    return null;
  }
  const workspace = data?.data.workspace as
    | GetSingleWorkspace
    | null
    | undefined;

  if (!workspace) {
    return null;
  }

  return (
    <div>
      <EditWorkspaceForm workspace={workspace} />
    </div>
  );
}
