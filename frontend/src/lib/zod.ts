import z from "zod";
import { TaskStatus } from "./types";

export const signupFormSchema = z.object({
  name: z.string().trim().min(2, {
    message: "Name is required",
  }),
  email: z.email().trim().min(2, {
    message: "Email required",
  }),
  password: z.string().trim().min(5, {
    message: "Password required",
  }),
});

export const signinFormSchema = z.object({
  email: z.email().trim().min(2, {
    message: "Email required",
  }),
  password: z.string().trim().min(5, {
    message: "Password required",
  }),
});

export const workspaceFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name length is too low",
  }),
  image_url: z.string(),
});

export const projectFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name length is too low",
  }),
  image_url: z.string(),
});

export const createTaskSchema = z.object({
  name: z.string().min(1, "Required").trim(),
  status: z.nativeEnum(TaskStatus, { error: "Required" }),
  workspace_id: z.string().trim().min(1, "Required"),
  project_id: z.string().trim().min(1, "Required"),
  due_date: z.coerce.date(),
  assignee_id: z.string().trim().min(1, "Required"),
});
