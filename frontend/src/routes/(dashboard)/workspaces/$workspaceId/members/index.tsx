import MemberList from "@/features/workspace/components/member-list";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(dashboard)/workspaces/$workspaceId/members/"
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
  return (
    <div className="w-full lg:max-w-xl ">
      <MemberList />
    </div>
  );
}
