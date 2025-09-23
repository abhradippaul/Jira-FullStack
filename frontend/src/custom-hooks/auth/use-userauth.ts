import type { signupFormSchema } from "@/lib/zod";
import { useMutation } from "@tanstack/react-query";
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
      return axios.post(`${BACKEND_URL}/auth/signin`, body);
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
