import express from "express";
import { signupUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/schema-validation.middleware.js";
import { userInsertSchema } from "../db/schema.js";
import { userSigninSchema } from "../utils/types.js";

const router = express.Router();

router.route("/signup").post(validate(userInsertSchema), signupUser);

router.route("/signin").post(validate(userSigninSchema), signupUser);

export { router };
