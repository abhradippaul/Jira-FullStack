import ResponsiveModal from "@/components/responsive-modal";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { Route } from "@/routes/(dashboard)/workspaces/$workspaceId/projects/$projectId";
import CreateTaskFormWrapper from "./create-task-form-wrapper";

function CreateTaskModal() {
  const routerState = useRouterState();
  const { projectId, workspaceId } = Route.useParams();
  const router = useRouter();
  const searchParams = routerState.location.search as Record<
    string,
    string | undefined
  >;
  const modal = searchParams?.taskModal;
  const isOpen = modal === "open" ? true : false;

  if (!workspaceId || !projectId) return null;

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={() => {
        router.navigate({
          to: location.pathname,
          search: {
            taskModal: "close",
          },
        });
      }}
    >
      <CreateTaskFormWrapper
        projectId={projectId}
        workspaceId={workspaceId}
        onCancel={() => {
          router.navigate({
            to: location.pathname,
            search: {
              taskModal: "close",
            },
          });
        }}
      />
    </ResponsiveModal>
  );
}

export default CreateTaskModal;
