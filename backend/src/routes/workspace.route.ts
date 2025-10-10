import express from "express";
import {
  createWorkspace,
  deleteWorkspace,
  getSingleWorkspace,
  getWorkspaceForJoin,
  getWorkspaces,
  getWorkspaceS3ImageUrl,
  joinInWorkspace,
  putWorkspaceS3ImageUrl,
  resetInviteCodeForWorkspace,
  updateWorkspace,
} from "../controllers/workspace.controller.js";
import { verifyUserAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(verifyUserAuth, createWorkspace);

router.route("/").get(verifyUserAuth, getWorkspaces);

router
  .route("/s3-put-presigned-url")
  .post(verifyUserAuth, putWorkspaceS3ImageUrl);

router
  .route("/s3-get-presigned-url")
  .post(verifyUserAuth, getWorkspaceS3ImageUrl);

router
  .route("/join-workspace/:workspaceId")
  .post(verifyUserAuth, joinInWorkspace);

router
  .route("/get-workspace-for-invite/:workspaceId/:inviteCode")
  .get(verifyUserAuth, getWorkspaceForJoin);

router
  .route("/reset-invitecode/:workspaceId")
  .post(verifyUserAuth, resetInviteCodeForWorkspace);

router
  .route("/:workspaceId")
  .get(verifyUserAuth, getSingleWorkspace)
  .patch(verifyUserAuth, updateWorkspace)
  .delete(verifyUserAuth, deleteWorkspace);

export { router };
