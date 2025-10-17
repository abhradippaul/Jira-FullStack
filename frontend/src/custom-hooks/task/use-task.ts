import { getQueryClient } from "@/provider/queryclient-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const queryClient = getQueryClient();

interface TypeGetTasks {
  workspaceId: string;
  status?: string | null;
  search?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  projectId?: string | null;
}

export async function useGetTasks({
  assigneeId,
  dueDate,
  projectId,
  search,
  status,
  workspaceId,
}: TypeGetTasks) {
  return useQuery({
    queryFn: () => {
      return axios.get(`${BACKEND_URL}/task/${workspaceId}/all`, {
        withCredentials: true,
        params: {
          status,
          search,
          assigneeId,
          dueDate,
          projectId,
        },
      });
    },
    queryKey: [
      "tasks",
      workspaceId,
      status,
      search,
      assigneeId,
      dueDate,
      projectId,
    ],
  });
}

interface TypeCreateTask {
  workspaceId: string;
  name: string;
  description?: string | null;
  status: string;
  search: string;
  assigneeId: string;
  dueDate: string;
  projectId: string;
}

export function useCreateTask() {
  return useMutation({
    mutationFn: (body: TypeCreateTask) => {
      return axios.post(`${BACKEND_URL}/task`, body, {
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      console.log(res.data);
      toast.success("Task created successfully");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Failed to create task");
      }
    },
  });
}

interface TypeDeleteTask {
  workspaceId: string;
  projectId: string;
  taskId: string;
}

export function useDeleteTask({
  projectId,
  taskId,
  workspaceId,
}: TypeDeleteTask) {
  return useMutation({
    mutationFn: () => {
      return axios.delete(
        `${BACKEND_URL}/task/${workspaceId}/${projectId}/${taskId}`,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      toast.success("Task deleted successfully");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Failed to delete task");
      }
    },
  });
}
