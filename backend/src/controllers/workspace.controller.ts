import type { Request, Response } from "express";
import { users, workspaces } from "../db/schema.js";
import { db } from "../db/index.js";
import { and, desc, eq } from "drizzle-orm";
import { getS3SignedUrl } from "../utils/aws/s3.js";

export async function createWorkspace(req: Request, res: Response) {
  try {
    const { name, user_id, image_url } = req.body;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!name) {
      return res.status(400).json({
        msg: "Workspace name not found",
      });
    }

    const isUserExist = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, user_id));

    if (!isUserExist.length) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const isWorkspaceCreated = await db.insert(workspaces).values({
      user_id,
      name,
      image_url: image_url || "",
    });

    if (!isWorkspaceCreated.rowCount) {
      return res.status(400).json({
        msg: "Workspace created unsuccessful",
      });
    }

    return res.status(201).json({
      msg: "Workspace created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function updateWorkspace(req: Request, res: Response) {
  try {
    const { workspaceId } = req.params;
    const { name, user_id } = req.body;

    if (!workspaceId) {
      return res.status(404).json({
        msg: "Workspace id not found",
      });
    }

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!name) {
      return res.status(400).json({
        msg: "Workspace name not found",
      });
    }

    const isUserExist = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, user_id));

    if (!isUserExist.length) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const isWorkspaceUpdated = await db
      .update(workspaces)
      .set({
        name,
      })
      .where(
        and(eq(workspaces.id, workspaceId), eq(workspaces.user_id, user_id))
      );

    if (!isWorkspaceUpdated.rowCount) {
      return res.status(400).json({
        msg: "Workspace update unsuccessful",
      });
    }

    return res.status(200).json({
      msg: "Workspace update successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function deleteWorkspace(req: Request, res: Response) {
  try {
    const { workspaceId } = req.params;
    const { user_id } = req.body;

    if (!workspaceId) {
      return res.status(404).json({
        msg: "Workspace id not found",
      });
    }

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    const isUserExist = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, user_id));

    if (!isUserExist.length) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const isWorkspaceDeleted = await db
      .delete(workspaces)
      .where(
        and(eq(workspaces.id, workspaceId), eq(workspaces.user_id, user_id))
      );

    if (!isWorkspaceDeleted.rowCount) {
      return res.status(400).json({
        msg: "Workspace delete unsuccessful",
      });
    }

    return res.status(200).json({
      msg: "Workspace delete successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function getWorkspaces(req: Request, res: Response) {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    const workspaceList = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        image_url: workspaces.image_url,
      })
      .from(workspaces)
      .where(eq(workspaces.user_id, user_id))
      .orderBy(desc(workspaces.created_at));

    return res.status(200).json({
      workspaces: workspaceList,
      msg: "Workspace fetched successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function getWorkspaceS3ImageUrl(req: Request, res: Response) {
  try {
    const { user_id, mime } = req.body;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!mime) {
      return res.status(400).json({
        msg: "Missing mime type",
      });
    }

    const key = `workspaces/${user_id}/${Date.now()}.${mime}`;

    const s3Url = await getS3SignedUrl(key);

    return res.status(200).json({
      url: s3Url,
      key,
      msg: "S3 image url fetched successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}
