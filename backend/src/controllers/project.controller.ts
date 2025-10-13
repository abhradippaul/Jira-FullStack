import type { Request, Response } from "express";
import { projects, users, workspaceMembers, workspaces } from "../db/schema.js";
import { db } from "../db/index.js";
import { and, desc, eq } from "drizzle-orm";

export async function createProject(req: Request, res: Response) {
  try {
    const { workspaceId } = req.params;
    const { user_id, name, image_url } = req.body;

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

    const isProjectCreated = await db.insert(projects).values({
      name,
      workspace_id: workspaceId,
      image_url,
    });

    if (!isProjectCreated.rowCount) {
      return res.status(400).json({
        msg: "Project creation failed",
      });
    }

    return res.status(200).json({
      msg: "Project created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function getProjects(req: Request, res: Response) {
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

    const projectList = await db
      .select({
        id: projects.id,
        name: projects.name,
        imageUrl: projects.image_url,
      })
      .from(users)
      .innerJoin(workspaceMembers, eq(workspaceMembers.user_id, users.id))
      .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspace_id))
      .innerJoin(projects, eq(projects.workspace_id, workspaces.id))
      .where(
        and(
          eq(users.id, user_id),
          eq(workspaceMembers.workspace_id, workspaceId)
        )
      )
      .orderBy(desc(projects.updated_at));

    return res.status(200).json({
      projects: projectList,
      msg: "Projects fetched successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function editProject(req: Request, res: Response) {
  try {
    const { user_id, name, imageUrl } = req.body;
    const { workspaceId, projectId } = req.params;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!workspaceId || !projectId) {
      return res.status(404).json({
        msg: "Workspace id or member id not found",
      });
    }

    if (!name) {
      return res.status(400).json({
        msg: "Name cannot be empty",
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

    const isMemberRoleUpdatedInWorkspace = await db
      .update(projects)
      .set({
        name,
        image_url: imageUrl,
      })
      .where(and(eq(projects.id, projectId)));

    if (!isMemberRoleUpdatedInWorkspace.rowCount) {
      return res.status(404).json({
        msg: "Failed to edit project",
      });
    }

    return res.status(200).json({
      msg: "Project edited successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const { user_id } = req.body;
    const { workspaceId, projectId } = req.params;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!workspaceId || !projectId) {
      return res.status(404).json({
        msg: "Workspace id or project id not found",
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

    const isProjectDeleted = await db
      .delete(projects)
      .where(and(eq(projects.id, projectId)));

    if (!isProjectDeleted.rowCount) {
      return res.status(404).json({
        msg: "Member not exists in workspace",
      });
    }

    return res.status(200).json({
      msg: "Project deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}
