"use client";

import UserButton from "@/features/auth/components/user-button";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      const isCookieExists = document.cookie
        .split(";")
        .filter((c) => c.includes("isAuthenticated"));
      if (!isCookieExists[0].split("=")[1]) {
        throw redirect({ to: "/auth/sign-in" });
      }
    }
  },
  component: Index,
});

function Index() {
  return (
    <div>
      <UserButton />
    </div>
  );
}
