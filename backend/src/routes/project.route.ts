import express from "express";
import {
  createProject,
  deleteProject,
  editProject,
  getProject,
  getProjects,
  getWorkspaceS3ImageUrl,
  putWorkspaceS3ImageUrl,
} from "../controllers/project.controller.js";
import { verifyUserAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/s3-put-presigned-url")
  .post(verifyUserAuth, putWorkspaceS3ImageUrl);

router
  .route("/s3-get-presigned-url")
  .post(verifyUserAuth, getWorkspaceS3ImageUrl);

router.route("/:workspaceId/all").get(verifyUserAuth, getProjects);

router.route("/:workspaceId").post(verifyUserAuth, createProject);

router.route("/:workspaceId/:projectId").get(verifyUserAuth, getProject);
router
  .route("/:workspaceId/:projectId")
  .patch(verifyUserAuth, editProject)
  .delete(verifyUserAuth, deleteProject);

export { router };
