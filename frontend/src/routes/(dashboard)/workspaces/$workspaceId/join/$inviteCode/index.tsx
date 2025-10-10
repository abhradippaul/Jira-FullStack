import JoinWorkspaceForm from "@/components/join-workspace-form";
import { useGetJoinWorkspace } from "@/custom-hooks/workspace/use-workspace";
import type { GetSingleWorkspaceForInvite } from "@/lib/types";
import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/(dashboard)/workspaces/$workspaceId/join/$inviteCode/"
)({
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
