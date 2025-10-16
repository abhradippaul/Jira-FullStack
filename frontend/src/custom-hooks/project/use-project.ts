import { getQueryClient } from "@/provider/queryclient-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const queryClient = getQueryClient();

interface TypeCreateProject {
  name: string;
  image_url: string | null | undefined;
}

export function useCreateProject(
  workspaceId: string,
  onSuccess: (projectId: string) => void
) {
  return useMutation({
    mutationFn: (body: TypeCreateProject) => {
      return axios.post(`${BACKEND_URL}/project/${workspaceId}`, body, {
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      console.log(res.data);
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      if (res.data.projectId) {
        onSuccess(res.data.projectId);
      }
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Failed to create project");
      }
    },
  });
}

export function useDeleteProject(workspaceId: string, projectId: string) {
  return useMutation({
    mutationFn: () => {
      return axios.delete(
        `${BACKEND_URL}/project/${workspaceId}/${projectId}`,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Failed to delete project");
      }
    },
  });
}

export function useUpdateProject(workspaceId: string, projectId: string) {
  return useMutation({
    mutationFn: (body: TypeCreateProject) => {
      return axios.patch(
        `${BACKEND_URL}/project/${workspaceId}/${projectId}`,
        body,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Failed to update project");
      }
    },
  });
}

export function useGetProjects(workspaceId: string) {
  return useQuery({
    queryFn: () => {
      return axios.get(`${BACKEND_URL}/project/${workspaceId}/all`, {
        withCredentials: true,
      });
    },
    queryKey: ["projects", workspaceId],
  });
}

export function useGetProject(workspaceId: string, projectId: string) {
  return useQuery({
    queryFn: () => {
      return axios.get(`${BACKEND_URL}/project/${workspaceId}/${projectId}`, {
        withCredentials: true,
      });
    },
    queryKey: ["project", projectId],
  });
}
