import MemberList from "@/features/workspace/components/member-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(dashboard)/workspaces/$workspaceId/members/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full lg:max-w-xl ">
      <MemberList />
    </div>
  );
}
