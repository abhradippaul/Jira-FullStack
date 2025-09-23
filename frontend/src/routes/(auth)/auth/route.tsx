"use client";

import { Button } from "@/components/ui/button";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/auth")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/auth") {
      throw redirect({ to: "/auth/sign-in" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();
  const linkPath = pathname.includes("sign-up")
    ? "/auth/sign-in"
    : "/auth/sign-up";
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen p-4">
        <nav className="flex justify-between items-center">
          <img src="/logo.svg" className="w-[152px] h-[56px]" alt="Logo" />
          <Link to={linkPath}>
            <Button variant="secondary" className="cursor-pointer">
              {pathname.includes("sign-up") ? "Sign In" : "Sign Up"}
            </Button>
          </Link>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
