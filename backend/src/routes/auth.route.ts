import express from "express";
import {
  getCurrentUser,
  signinUser,
  signoutUser,
  signupUser,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/schema-validation.middleware.js";
import { userInsertSchema } from "../db/schema.js";
import { userSigninSchema } from "../utils/types.js";

const router = express.Router();

router.route("/signup").post(validate(userInsertSchema), signupUser);

router.route("/signin").post(validate(userSigninSchema), signinUser);

router.route("/signout").delete(signoutUser);

router.route("/current-user").get(getCurrentUser);

export { router };
