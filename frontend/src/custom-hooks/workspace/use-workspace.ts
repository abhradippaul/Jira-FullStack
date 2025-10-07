import { getQueryClient } from "@/provider/queryclient-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
interface WorkspaceInsert {
  name: string;
  image_url: string | null | undefined;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const queryClient = getQueryClient();

export function useCreateWorkspace(onSuccess: (res: string) => void) {
  return useMutation({
    mutationFn: (body: WorkspaceInsert) => {
      return axios.post(`${BACKEND_URL}/workspace`, body, {
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      toast.success("Workspace created successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      onSuccess(res.data.workspace_id);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Workspace creation unsuccessfully");
      }
    },
  });
}

export function useDeleteWorkspace() {
  return useMutation({
    mutationFn: (workspaceId: string) => {
      return axios.delete(`${BACKEND_URL}/workspace/${workspaceId}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      toast.success("Workspace deleted successfully");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Workspace deletion unsuccessfully");
      }
    },
  });
}

export function useUpdateWorkspace(workspaceId: string) {
  return useMutation({
    mutationFn: (body: WorkspaceInsert) => {
      return axios.patch(`${BACKEND_URL}/workspace/${workspaceId}`, body, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      toast.success("Workspace updated successfully");
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Workspace updation unsuccessfully");
      }
    },
  });
}

export function useGetWorkspaces() {
  return useQuery({
    queryFn: () => {
      return axios.get(`${BACKEND_URL}/workspace`, {
        withCredentials: true,
      });
    },
    queryKey: ["workspaces"],
  });
}

export function useGetWorkspace(workspaceId: string) {
  return useQuery({
    queryFn: () => {
      return axios.get(`${BACKEND_URL}/workspace/${workspaceId}`, {
        withCredentials: true,
      });
    },
    queryKey: ["workspace", workspaceId],
    enabled: Boolean(workspaceId),
  });
}
