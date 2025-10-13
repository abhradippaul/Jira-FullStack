import express from "express";
import {
  createProject,
  deleteProject,
  editProject,
  getProjects,
} from "../controllers/project.controller.js";
import { verifyUserAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/:workspaceId").get(verifyUserAuth, getProjects);

router.route("/:workspaceId").post(verifyUserAuth, createProject);

router
  .route("/:workspaceId/:projectId")
  .patch(verifyUserAuth, editProject)
  .delete(verifyUserAuth, deleteProject);

export { router };
