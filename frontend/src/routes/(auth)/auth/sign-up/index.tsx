import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/auth/sign-up/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Sign up page</div>;
}
