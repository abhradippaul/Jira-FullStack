import CreateWorkspaceForm from "@/features/workspace/components/create-workspace-form";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/workspaces/create/")({
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
  return (
    <div className="flex items-center justify-center w-full overflow-hidden">
      <div className="w-[90%] max-w-[900px]">
        <CreateWorkspaceForm />
      </div>
    </div>
  );
}
