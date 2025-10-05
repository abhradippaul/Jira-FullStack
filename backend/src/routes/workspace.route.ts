import express from "express";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaces,
  getWorkspaceS3ImageUrl,
  updateWorkspace,
} from "../controllers/workspace.controller.js";
import { verifyUserAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(verifyUserAuth, createWorkspace);

router.route("/:workspaceId").patch(verifyUserAuth, updateWorkspace);

router.route("/:workspaceId").delete(verifyUserAuth, deleteWorkspace);

router.route("/").get(verifyUserAuth, getWorkspaces);

router.route("/s3-presigned-url").post(verifyUserAuth, getWorkspaceS3ImageUrl);

export { router };
