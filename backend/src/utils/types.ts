import { z } from "zod";
import { userInsertSchema } from "../db/schema.js";

export type UserSignup = z.infer<typeof userInsertSchema>;
export const userSigninSchema = userInsertSchema.omit({ name: true });
export type UserSignin = z.infer<typeof userSigninSchema>;
