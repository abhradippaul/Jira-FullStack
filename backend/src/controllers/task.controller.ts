import type { Request, Response } from "express";
import {
  projects,
  tasks,
  users,
  workspaceMembers,
  workspaces,
} from "../db/schema.js";
import { db } from "../db/index.js";
import { and, desc, eq, ilike } from "drizzle-orm";

export async function createTask(req: Request, res: Response) {
  try {
    const {
      user_id,
      name,
      workspaceId,
      projectId,
      descripton,
      assigneeId,
      status,
      dueDate,
    } = req.body;

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

    if (!name || !assigneeId || !status || !dueDate) {
      return res.status(404).json({
        msg: "Missing required details",
      });
    }

    const isUserAndProjectExist = await db
      .select({ id: users.id, workspace_owner_id: workspaces.user_id })
      .from(users)
      .innerJoin(workspaceMembers, eq(workspaceMembers.user_id, user_id))
      .innerJoin(workspaces, eq(workspaces.id, workspaceId))
      .innerJoin(projects, eq(projects.workspace_id, workspaces.id))
      .where(
        and(
          eq(users.id, user_id),
          eq(workspaceMembers.workspace_id, workspaceId),
          eq(projects.id, projectId),
          eq(workspaceMembers.role, "admin")
        )
      );

    if (!isUserAndProjectExist.length) {
      return res.status(404).json({
        msg: "User or workspace or project is not found",
      });
    }

    const highestPositionTask = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.workspace_id, workspaceId),
          // eq(tasks.project_id, project_id),
          eq(tasks.status, status)
        )
      )
      .orderBy(desc(tasks.poisition))
      .limit(1);

    const newPosition =
      highestPositionTask.length > 0
        ? highestPositionTask[0]?.poisition || 0 + 1000
        : 1000;

    const isTaskCreated = await db.insert(tasks).values({
      name,
      assignee_id: assigneeId,
      due_date: dueDate,
      poisition: newPosition,
      project_id: projectId,
      workspace_id: workspaceId,
      descripton,
      status,
    });

    if (!isTaskCreated.rowCount) {
      return res.status(400).json({
        msg: "Failed to create task",
      });
    }

    return res.status(200).json({
      msg: "Task created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function getTasks(req: Request, res: Response) {
  try {
    const { workspaceId } = req.params;
    const { status, search, assigneeId, dueDate, projectId } = req.query;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!workspaceId || !projectId) {
      return res.status(404).json({
        msg: "Workspace or project id not found",
      });
    }

    const isMemberExists = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspace_id, workspaceId),
          eq(workspaceMembers.user_id, user_id)
        )
      );

    if (!isMemberExists.length) {
      return res.status(400).json({
        msg: "User does not exist",
      });
    }

    const condition = [ilike(tasks.workspace_id, `%${workspaceId}`)];

    if (projectId) {
      condition.push(ilike(tasks.project_id, `%${projectId}`));
    }

    if (status) {
      condition.push(ilike(tasks.status, `%${status}`));
    }

    if (assigneeId) {
      condition.push(ilike(tasks.assignee_id, `%${assigneeId}`));
    }

    if (dueDate) {
      condition.push(ilike(tasks.due_date, `%${dueDate}`));
    }

    if (search) {
      condition.push(ilike(tasks.name, `%${search}`));
    }

    const taskList = await db
      .select()
      .from(tasks)
      .innerJoin(projects, eq(projects.id, tasks.project_id))
      .innerJoin(users, eq(users.id, tasks.assignee_id))
      .where(and(...condition))
      .orderBy(desc(tasks.created_at));

    return res.status(200).json({
      tasks: taskList,
      msg: "Tasks fetched successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function getTask(req: Request, res: Response) {
  try {
    const { workspaceId, projectId, taskId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!workspaceId || !projectId || !taskId) {
      return res.status(404).json({
        msg: "Workspace or project or task id not found",
      });
    }

    const task = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.id, taskId),
          eq(tasks.workspace_id, workspaceId),
          eq(tasks.project_id, projectId)
        )
      );

    if (!task.length) {
      return res.status(404).json({
        msg: "Task not found",
      });
    }

    return res.status(200).json({
      task,
      msg: "Task fetched successfully",
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
    const { workspaceId, projectId, taskId } = req.params;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!workspaceId || !projectId || !taskId) {
      return res.status(404).json({
        msg: "Workspace id or project id or task id not found",
      });
    }

    const isUserTaskExist = await db
      .select()
      .from(users)
      .innerJoin(workspaceMembers, eq(workspaceMembers.user_id, user_id))
      .innerJoin(workspaces, eq(workspaces.id, workspaceId))
      .innerJoin(projects, eq(projects.workspace_id, workspaces.id))
      .innerJoin(tasks, eq(tasks.project_id, taskId))
      .where(
        and(
          eq(users.id, user_id),
          eq(workspaceMembers.workspace_id, workspaceId),
          eq(projects.id, projectId),
          eq(workspaceMembers.role, "admin"),
          eq(tasks.id, taskId)
        )
      );

    if (!isUserTaskExist.length) {
      return res.status(404).json({
        msg: "User or task is not found",
      });
    }

    const isTaskDeleted = await db
      .delete(projects)
      .where(and(eq(projects.id, projectId)));

    if (!isTaskDeleted.rowCount) {
      return res.status(404).json({
        msg: "Failed to delete task",
      });
    }

    return res.status(200).json({
      msg: "Task deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}
