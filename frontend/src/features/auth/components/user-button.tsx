import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DottedSeparator from "@/components/ui/dotted-separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUser, useSignOut } from "@/custom-hooks/auth/use-userauth";
import type { GetCurrentUserType } from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";
import { Loader, LogOut } from "lucide-react";

function UserButton() {
  const { data, isLoading, isError } = useGetUser();
  const navigate = useNavigate();
  const signOutSuccess = () => {
    navigate({ to: "/auth/sign-in" });
  };
  const userSignOut = useSignOut(signOutSuccess);

  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return null;
  }

  const userInfo = data?.data.user as GetCurrentUserType | null;
  const avatarFallback = userInfo?.name
    ? userInfo.name.charAt(0).toUpperCase()
    : "U";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300 ">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] hover:opacity-75 transition border border-neutral-300 ">
            <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">
              {userInfo?.name || "User"}
            </p>
            <p className="text-xs text-neutral-500">
              {userInfo?.email || "Email"}
            </p>
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        <DropdownMenuItem
          disabled={userSignOut.isPending}
          onClick={() => {
            userSignOut.mutate();
          }}
          className="h-10 flex items-center justify-center text-amber-700 cursor-pointer"
        >
          <LogOut className="size-3 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
