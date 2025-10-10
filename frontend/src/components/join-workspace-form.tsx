import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import DottedSeparator from "./ui/dotted-separator";
import { useJoinWorkspace } from "@/custom-hooks/workspace/use-workspace";

interface JoinWorkspaceFormProps {
  name: string;
  workspaceId: string;
  invite_code: string;
}

function JoinWorkspaceForm({
  name,
  workspaceId,
  invite_code,
}: JoinWorkspaceFormProps) {
  const router = useRouter();
  const joinWorkspace = useJoinWorkspace(workspaceId, () => {
    router.navigate({
      to: `/workspaces/${workspaceId}`,
    });
  });
  const handleJoinButtonClick = () => {
    joinWorkspace.mutate(invite_code);
  };
  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You have been invited to join <strong> {name} </strong>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
          <Button
            className="w-full lg:w-fit"
            variant="secondary"
            type="button"
            size="lg"
          >
            {" "}
            <Link to="/">Cancel</Link>{" "}
          </Button>
          <Button
            className="w-full lg:w-fit"
            variant="primary"
            type="button"
            size="lg"
            onClick={handleJoinButtonClick}
            disabled={joinWorkspace.isPending}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default JoinWorkspaceForm;
