"use server";

import { Button } from "@/components/ui/button";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen p-4">
        <nav className="flex justify-between items-center">
          <img src="/logo.svg" className="w-[152px] h-[56px]" alt="Logo" />
          <Button variant="secondary" className="cursor-pointer">
            Sign Up
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
