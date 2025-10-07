import ResponsiveModal from "@/components/responsive-modal";
import CreateWorkspaceForm from "./create-workspace-form";
import { useRouter, useRouterState } from "@tanstack/react-router";

function CreateWorkspaceModal() {
  const routerState = useRouterState();
  const router = useRouter();
  const searchParams = routerState.location.search as Record<
    string,
    string | undefined
  >;
  const modal = searchParams?.workspaceModal;
  const isOpen = modal === "open" ? true : false;

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={() => {
        router.navigate({
          to: location.pathname,
          search: {
            workspaceModal: "close",
          },
        });
      }}
    >
      <CreateWorkspaceForm
        onCancel={() => {
          router.navigate({
            to: location.pathname,
            search: {
              workspaceModal: "close",
            },
          });
        }}
      />
    </ResponsiveModal>
  );
}

export default CreateWorkspaceModal;
