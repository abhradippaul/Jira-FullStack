import { getQueryClient } from "@/provider/queryclient-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const queryClient = getQueryClient();

export function useGetWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryFn: () => {
      return axios.get(`${BACKEND_URL}/workspace-members/${workspaceId}`, {
        withCredentials: true,
      });
    },
    queryKey: ["member", workspaceId],
  });
}

export function useUpdateWorkspaceMemberRole(
  workspaceId: string,
  memberId: string
) {
  return useMutation({
    mutationFn: (role: string) => {
      return axios.patch(
        `${BACKEND_URL}/workspace-members/${workspaceId}/${memberId}`,
        { role },
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      toast.success("Workspace member role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["member", workspaceId] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Workspace member role update failed");
      }
    },
  });
}

export function useRemoveMemberFromWorkspace(workspaceId: string) {
  return useMutation({
    mutationFn: (memberId: string) => {
      return axios.delete(
        `${BACKEND_URL}/workspace-members/${workspaceId}/${memberId}`,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      toast.success("Member removed from workspace successfully");
      queryClient.invalidateQueries({ queryKey: ["member", workspaceId] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Member remove from workspace failed");
      }
    },
  });
}
