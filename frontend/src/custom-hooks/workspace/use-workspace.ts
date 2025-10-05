import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
interface WorkspaceInsert {
  name: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useCreateWorkspace() {
  return useMutation({
    mutationFn: (body: WorkspaceInsert) => {
      return axios.post(`${BACKEND_URL}/workspace`, body, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      toast.success("Workspace created successfully");
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

interface UpdateWorkspace extends WorkspaceInsert {
  workspaceId: string;
}

export function useUpdateWorkspace() {
  return useMutation({
    mutationFn: ({ name, workspaceId }: UpdateWorkspace) => {
      return axios.patch(`${BACKEND_URL}/workspace/${workspaceId}`, name, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      toast.success("Workspace updated successfully");
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

export function useGetWorkspace() {
  return useMutation({
    mutationFn: () => {
      return axios.get(`${BACKEND_URL}/workspace`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      toast.success("Workspace updated successfully");
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
