import JoinWorkspaceForm from "@/components/join-workspace-form";
import { useGetJoinWorkspace } from "@/custom-hooks/workspace/use-workspace";
import type { GetSingleWorkspaceForInvite } from "@/lib/types";
import {
  createFileRoute,
  redirect,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/(dashboard)/workspaces/$workspaceId/join/$inviteCode/"
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
  const router = useRouter();
  const { inviteCode, workspaceId } = useParams({ strict: false });
  const { data, isLoading, isError } = useGetJoinWorkspace(
    workspaceId || "",
    inviteCode || ""
  );

  const workspace = data?.data as GetSingleWorkspaceForInvite;
  useEffect(() => {
    if (workspace?.alreadyMember) {
      router.navigate({
        to: `/workspaces/${workspaceId}`,
      });
    }
  }, [workspace, workspaceId]);

  if (isError || isLoading) return null;

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        name={workspace.workspace?.name || ""}
        workspaceId={workspaceId || ""}
        invite_code={inviteCode || ""}
      />
    </div>
  );
}
