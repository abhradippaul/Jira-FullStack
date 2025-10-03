import SignUpCard from "@/features/auth/components/sign-up-card";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/auth/sign-up/")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/auth") {
      const isCookieExists = document.cookie
        .split(";")
        .filter((c) => c.includes("isAuthenticated"));
      if (isCookieExists.length) {
        throw redirect({ to: "/" });
      }
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <SignUpCard />;
}
