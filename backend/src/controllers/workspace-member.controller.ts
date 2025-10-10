import type { Request, Response } from "express";
import { users, workspaceMembers, workspaces } from "../db/schema.js";
import { db } from "../db/index.js";
import { and, desc, eq } from "drizzle-orm";

export async function getWorkspaceMembers(req: Request, res: Response) {
  try {
    const { workspaceId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!workspaceId) {
      return res.status(404).json({
        msg: "Workspace id not found",
      });
    }

    const isUserAdminInWorkspace = await db
      .select({ id: workspaceMembers.user_id })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.user_id, user_id),
          eq(workspaceMembers.workspace_id, workspaceId),
          eq(workspaceMembers.role, "admin")
        )
      );

    if (!isUserAdminInWorkspace.length) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const workspaceUsers = await db
      .select({
        id: users.id,
        name: users.name,
        role: workspaceMembers.role,
      })
      .from(workspaceMembers)
      .leftJoin(users, eq(workspaceMembers.user_id, users.id))
      .where(and(eq(workspaceMembers.workspace_id, workspaceId)))
      .orderBy(desc(workspaceMembers.updated_at));

    return res.status(200).json({
      workspaceMembers: workspaceUsers,
      msg: "Workspace member fetched successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function changeMemberRoleInWorkspace(req: Request, res: Response) {
  try {
    const { user_id, role = "member" } = req.body;
    const { workspaceId, memberId } = req.params;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!workspaceId || !memberId) {
      return res.status(404).json({
        msg: "Workspace id or member id not found",
      });
    }

    const isUserAndWorkspaceExist = await db
      .select({ id: users.id, workspace_owner_id: workspaces.user_id })
      .from(users)
      .innerJoin(workspaceMembers, eq(workspaceMembers.user_id, user_id))
      .innerJoin(workspaces, eq(workspaces.id, workspaceId))
      .where(
        and(
          eq(users.id, user_id),
          eq(workspaceMembers.workspace_id, workspaceId),
          eq(workspaceMembers.role, "admin")
        )
      );

    if (!isUserAndWorkspaceExist.length) {
      return res.status(404).json({
        msg: "User or workspace is not found",
      });
    }

    if (isUserAndWorkspaceExist[0]?.id === user_id) {
      return res.status(400).json({
        msg: "You cannot change your role",
      });
    }

    if (memberId === isUserAndWorkspaceExist[0]?.workspace_owner_id) {
      return res.status(400).json({
        msg: "You cannot change owner role",
      });
    }

    const isMemberExistInWorkspace = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.user_id, memberId),
          eq(workspaceMembers.workspace_id, workspaceId)
        )
      );

    if (!isMemberExistInWorkspace.length) {
      return res.status(404).json({
        msg: "Member not exists in workspace",
      });
    }

    const isMemberRoleUpdatedInWorkspace = await db
      .update(workspaceMembers)
      .set({
        role,
      })
      .where(
        and(
          eq(workspaceMembers.user_id, memberId),
          eq(workspaceMembers.workspace_id, workspaceId)
        )
      );

    if (!isMemberRoleUpdatedInWorkspace.rowCount) {
      return res.status(404).json({
        msg: "Failed to update member role in workspace",
      });
    }

    return res.status(200).json({
      msg: "Member role changed successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function removeMemberFromWorkspace(req: Request, res: Response) {
  try {
    const { user_id } = req.body;
    const { workspaceId, memberId } = req.params;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!workspaceId || !memberId) {
      return res.status(404).json({
        msg: "Workspace id or member id not found",
      });
    }

    const isUserAndWorkspaceExist = await db
      .select({ id: users.id })
      .from(users)
      .innerJoin(workspaceMembers, eq(workspaceMembers.user_id, user_id))
      .where(
        and(
          eq(users.id, user_id),
          eq(workspaceMembers.workspace_id, workspaceId),
          eq(workspaceMembers.role, "admin")
        )
      );

    if (!isUserAndWorkspaceExist.length) {
      return res.status(404).json({
        msg: "User or workspace is not found",
      });
    }

    const isMemberDeletedFromWorkspace = await db
      .delete(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.user_id, memberId),
          eq(workspaceMembers.workspace_id, workspaceId)
        )
      );

    if (!isMemberDeletedFromWorkspace.rowCount) {
      return res.status(404).json({
        msg: "Member not exists in workspace",
      });
    }

    return res.status(200).json({
      msg: "Member successfully removed from the workspace",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}
