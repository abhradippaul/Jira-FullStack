import SignInCard from "@/features/auth/components/sign-in-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/auth/sign-in/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignInCard />;
}
