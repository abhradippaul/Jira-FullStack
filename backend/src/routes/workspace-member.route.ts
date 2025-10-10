import express from "express";
import {
  changeMemberRoleInWorkspace,
  getWorkspaceMembers,
  removeMemberFromWorkspace,
} from "../controllers/workspace-member.controller.js";
import { verifyUserAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/:workspaceId").get(verifyUserAuth, getWorkspaceMembers);

router
  .route("/:workspaceId/:memberId")
  .patch(verifyUserAuth, changeMemberRoleInWorkspace)
  .delete(verifyUserAuth, removeMemberFromWorkspace);

export { router };
