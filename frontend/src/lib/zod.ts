import z from "zod";

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
