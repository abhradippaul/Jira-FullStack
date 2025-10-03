import type { signupFormSchema } from "@/lib/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import type z from "zod";
type UserInsert = z.infer<typeof signupFormSchema>;
interface UserSignIn {
  email: string;
  password: string;
}
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useSignUp(onSuccess: () => void) {
  return useMutation({
    mutationFn: (body: UserInsert) => {
      return axios.post(`${BACKEND_URL}/auth/signup`, body);
    },
    onSuccess: () => {
      onSuccess();
      toast.success("Account creation successfully");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Account creation unsuccessfully");
      }
    },
  });
}

export function useSignIn(onSuccess: () => void) {
  return useMutation({
    mutationFn: (body: UserSignIn) => {
      return axios.post(`${BACKEND_URL}/auth/signin`, body, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      toast.success("Account login successfully");
      onSuccess();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Account login unsuccessfully");
      }
    },
  });
}

export function useSignOut(onSuccess: () => void) {
  return useMutation({
    mutationFn: () => {
      return axios.delete(`${BACKEND_URL}/auth/signout`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      document.cookie = "isAuthenticated=";
      onSuccess();
      toast.success("Account logout successfully");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Account logout unsuccessfully");
      }
    },
  });
}

export function useGetUser() {
  return useQuery({
    queryFn: () => {
      return axios.get(`${BACKEND_URL}/auth/current-user`, {
        withCredentials: true,
      });
    },
    queryKey: ["user_info"],
  });
}
