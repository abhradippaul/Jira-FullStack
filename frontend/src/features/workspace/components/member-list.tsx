import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetWorkspaceMembers,
  useRemoveMemberFromWorkspace,
  useUpdateWorkspaceMemberRole,
} from "@/custom-hooks/member/use-workspaceMember";
import type { GetWorkspaceMembers } from "@/lib/types";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import DottedSeparator from "@/components/ui/dotted-separator";
import { Fragment } from "react/jsx-runtime";
import MemberAvatar from "./member-avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUser } from "@/custom-hooks/auth/use-userauth";

function MemberList() {
  const { workspaceId } = useParams({ strict: false });
  const { data, isLoading, isError } = useGetWorkspaceMembers(
    workspaceId || ""
  );
  const { data: userData } = useGetUser();
  const updateMemberRole = useUpdateWorkspaceMemberRole(workspaceId || "");
  const deleteMember = useRemoveMemberFromWorkspace(workspaceId || "");

  const workspaceMembers = data?.data as GetWorkspaceMembers | null | undefined;
  console.log(userData);

  const url = `/workspaces/${workspaceId || ""}`;

  if (isError || isLoading) return null;

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button variant="secondary" size="sm">
          <Link to={url} className="flex">
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Member list</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {workspaceMembers?.workspaceMembers?.map(
          ({ id, name, role, email }, index) => (
            <Fragment key={id}>
              <div className="flex items-center gap-2">
                <MemberAvatar
                  className="size-10"
                  fallbackClassName="text-lg"
                  name={name}
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">{email}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-auto" variant="secondary" size="icon">
                      <MoreVerticalIcon className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="end">
                    {role === "member" && (
                      <DropdownMenuItem
                        className="font-medium cursor-pointer"
                        onClick={() => {
                          if (id) {
                            updateMemberRole.mutate({
                              memberId: id,
                              role: "admin",
                            });
                          }
                        }}
                        disabled={
                          userData?.data.user.id === id ||
                          updateMemberRole.isPending ||
                          deleteMember.isPending
                        }
                      >
                        Set as Administrator
                      </DropdownMenuItem>
                    )}

                    {role === "admin" && (
                      <DropdownMenuItem
                        className="font-medium cursor-pointer"
                        onClick={() => {
                          if (id) {
                            updateMemberRole.mutate({
                              memberId: id,
                              role: "member",
                            });
                          }
                        }}
                        disabled={
                          userData?.data.user.id === id ||
                          updateMemberRole.isPending ||
                          deleteMember.isPending
                        }
                      >
                        Set as Member
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="font-medium text-amber-700 cursor-pointer"
                      onClick={() => {
                        deleteMember.mutate(id);
                      }}
                      disabled={
                        userData?.data.user.id === id ||
                        updateMemberRole.isPending ||
                        deleteMember.isPending
                      }
                    >
                      Remove {name}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {index <
                Number(workspaceMembers.workspaceMembers?.length) - 1 && (
                <Separator className="my-2.5" />
              )}
            </Fragment>
          )
        )}
      </CardContent>
    </Card>
  );
}

export default MemberList;
