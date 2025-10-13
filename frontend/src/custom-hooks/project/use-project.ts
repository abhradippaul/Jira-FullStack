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

export function useCreateProject(workspaceId: string) {
  return useMutation({
    mutationFn: (body: TypeCreateProject) => {
      return axios.post(`${BACKEND_URL}/project/${workspaceId}`, body, {
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      console.log(res.data);
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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
      return axios.get(`${BACKEND_URL}/project/${workspaceId}`, {
        withCredentials: true,
      });
    },
    queryKey: ["projects"],
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

// export function useResetInviteCodeWorkspace(workspaceId: string) {
//   return useMutation({
//     mutationFn: () => {
//       return axios.post(
//         `${BACKEND_URL}/workspace/reset-invitecode/${workspaceId}`,
//         "",
//         {
//           withCredentials: true,
//         }
//       );
//     },
//     onSuccess: () => {
//       toast.success("Workspace invite code updated successfully");
//       queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
//     },
//     onError: (err) => {
//       if (err instanceof AxiosError) {
//         toast.error(err.response?.data.msg);
//       } else {
//         toast.error("Workspace invite code update unsuccessful");
//       }
//     },
//   });
// }

// export function useJoinWorkspace(workspaceId: string, onSuccess: () => void) {
//   return useMutation({
//     mutationFn: (invite_code: string) => {
//       return axios.post(
//         `${BACKEND_URL}/workspace/join-workspace/${workspaceId}`,
//         {
//           invite_code,
//         },
//         {
//           withCredentials: true,
//         }
//       );
//     },
//     onSuccess: () => {
//       toast.success("Workspace joined successfully");
//       queryClient.invalidateQueries({ queryKey: ["workspaces"] });
//       onSuccess();
//     },
//     onError: (err) => {
//       if (err instanceof AxiosError) {
//         toast.error(err.response?.data.msg);
//       } else {
//         toast.error("Workspace joined failed");
//       }
//     },
//   });
// }

// export function useGetJoinWorkspace(workspaceId: string, invite_code: string) {
//   return useQuery({
//     queryFn: () => {
//       return axios.get(
//         `${BACKEND_URL}/workspace/get-workspace-for-invite/${workspaceId}/${invite_code}`,
//         {
//           withCredentials: true,
//         }
//       );
//     },
//     queryKey: ["workspace-invite", workspaceId],
//     retry: 1,
//   });
// }
