import express from "express";
import {
  deleteProject,
  editProject,
} from "../controllers/project.controller.js";
import { verifyUserAuth } from "../middlewares/auth.middleware.js";
import {
  createTask,
  getTask,
  getTasks,
} from "../controllers/task.controller.js";

const router = express.Router();

router.route("/").post(verifyUserAuth, createTask);

router.route("/:workspaceId/:projectId/all").get(verifyUserAuth, getTasks);

router
  .route("/:workspaceId/:projectId/:taskId")
  .get(verifyUserAuth, getTask)
  .patch(verifyUserAuth, editProject)
  .delete(verifyUserAuth, deleteProject);

export { router };
