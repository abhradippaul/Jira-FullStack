import ResponsiveModal from "@/components/responsive-modal";
import { useRouter, useRouterState } from "@tanstack/react-router";
import CreateProjectForm from "./create-project-form";

function UseCreateProjectModal() {
  const routerState = useRouterState();
  const router = useRouter();
  const searchParams = routerState.location.search as Record<
    string,
    string | undefined
  >;
  const modal = searchParams?.projectModal;
  const isOpen = modal === "open" ? true : false;

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={() => {
        router.navigate({
          to: location.pathname,
          search: {
            projectModal: "close",
          },
        });
      }}
    >
      <CreateProjectForm
        onCancel={() => {
          router.navigate({
            to: location.pathname,
            search: {
              projectModal: "close",
            },
          });
        }}
      />
    </ResponsiveModal>
  );
}

export default UseCreateProjectModal;
