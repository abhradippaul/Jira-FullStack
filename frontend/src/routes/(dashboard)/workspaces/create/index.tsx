import CreateWorkspaceForm from "@/features/workspace/components/create-workspace-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/workspaces/create/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center w-full overflow-hidden">
      <div className="w-[90%] max-w-[900px]">
        <CreateWorkspaceForm />
      </div>
    </div>
  );
}
