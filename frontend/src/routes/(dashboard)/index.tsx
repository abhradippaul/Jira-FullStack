"use client";
import { useGetWorkspaces } from "@/custom-hooks/workspace/use-workspace";
import type { GetWorkspaces } from "@/lib/types";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/(dashboard)/")({
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
  component: Index,
});

function Index() {
  const { data, isLoading, error } = useGetWorkspaces();
  const router = useRouter();
  const workspaces = data?.data.workspaces as
    | GetWorkspaces[]
    | null
    | undefined;

  useEffect(() => {
    if (!isLoading && !error) {
      if (!workspaces?.length) {
        router.navigate({ to: "/workspaces/create" });
      } else {
        router.navigate({
          to: "/workspaces/$workspaceId",
          params: { workspaceId: workspaces[0].id },
        });
      }
    }
  }, [workspaces, router]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return null;
}
