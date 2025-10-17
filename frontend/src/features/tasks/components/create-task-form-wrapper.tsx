import { useGetWorkspaceMembers } from "@/custom-hooks/member/use-workspaceMember";
import { useGetProjects } from "@/custom-hooks/project/use-project";
import CreateTaskForm from "./create-task-form";
import type { GetProjects, GetWorkspaceMembers } from "@/lib/types";

interface CreateTaskFormWrapperProps {
  onCancel?: () => void;
  workspaceId: string;
  projectId: string;
}

function CreateTaskFormWrapper({
  projectId,
  workspaceId,
  onCancel,
}: CreateTaskFormWrapperProps) {
  const getProjects = useGetProjects(workspaceId);
  const getMembers = useGetWorkspaceMembers(workspaceId);

  if (
    getProjects.isLoading ||
    getProjects.isError ||
    getMembers.isLoading ||
    getProjects.isError
  )
    return null;

  const projects = getProjects.data?.data as GetProjects | null | undefined;
  const members = getMembers.data?.data as
    | GetWorkspaceMembers
    | null
    | undefined;

  return (
    <CreateTaskForm
      projectId={projectId}
      workspaceId={workspaceId}
      onCancel={onCancel}
      projects={projects}
      members={members}
    />
  );
}

export default CreateTaskFormWrapper;
