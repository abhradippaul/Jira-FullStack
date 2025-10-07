import type { Request, Response } from "express";
import { users, workspaceMembers, workspaces } from "../db/schema.js";
import { db } from "../db/index.js";
import { and, desc, eq } from "drizzle-orm";
import {
  deleteS3Image,
  getS3SignedUrl,
  putS3SignedUrl,
} from "../utils/aws/s3.js";

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

    const inviteCode = String(Math.floor(Math.random() * 999999));

    const isWorkspaceCreated = await db
      .insert(workspaces)
      .values({
        user_id,
        name,
        image_url: image_url || "",
        invite_code: inviteCode,
      })
      .returning();

    if (!isWorkspaceCreated.length) {
      return res.status(400).json({
        msg: "Workspace created unsuccessful",
      });
    }

    const isWorkspaceMemberCreated = await db.insert(workspaceMembers).values({
      user_id,
      workspace_id: isWorkspaceCreated[0]?.id || "",
      role: "admin",
    });

    if (!isWorkspaceMemberCreated.rowCount) {
      return res.status(400).json({
        msg: "Workspace member created unsuccessful",
      });
    }

    return res.status(201).json({
      workspace_id: isWorkspaceCreated[0]?.id,
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
    const { name, user_id, image_url } = req.body;

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
      .select({
        user_id: users.id,
        workspace_image_key: workspaces.image_url,
        workspace_name: workspaces.name,
      })
      .from(users)
      .innerJoin(workspaceMembers, eq(workspaceMembers.user_id, user_id))
      .where(
        and(
          eq(users.id, user_id),
          eq(workspaceMembers.workspace_id, workspaceId),
          eq(workspaceMembers.role, "admin")
        )
      );

    if (!isUserExist.length) {
      return res.status(404).json({
        msg: "User or member not found",
      });
    }

    if (
      name === isUserExist[0]?.workspace_name &&
      image_url === isUserExist[0]?.workspace_image_key
    ) {
      return res.status(400).json({
        msg: "Noting for update",
      });
    }

    if (
      image_url != isUserExist[0]?.workspace_image_key &&
      isUserExist[0]?.workspace_image_key
    ) {
      const s3Response = await deleteS3Image(
        isUserExist[0]?.workspace_image_key || ""
      );
    }

    const isWorkspaceUpdated = await db
      .update(workspaces)
      .set({
        name,
        image_url,
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
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaceMembers.workspace_id, workspaces.id))
      .where(eq(workspaces.user_id, user_id))
      .orderBy(desc(workspaceMembers.created_at));

    // const result = await Promise.all(
    //   workspaceList.map(async (workspace) => {
    //     if (workspace.image_url) {
    //       const presignedUrl = await getS3SignedUrl(workspace.image_url);
    //       return { ...workspace, image_url: presignedUrl };
    //     }
    //     return workspace;
    //   })
    // );

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

export async function getSingleWorkspace(req: Request, res: Response) {
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

    const workspace = await db
      .select({
        workspace_id: workspaces.id,
        name: workspaces.name,
        image_url: workspaces.image_url,
      })
      .from(users)
      .innerJoin(workspaceMembers, eq(workspaceMembers.user_id, user_id))
      .innerJoin(workspaces, eq(workspaceMembers.workspace_id, workspaces.id))
      .where(
        and(eq(workspaces.user_id, user_id), eq(workspaces.id, workspaceId))
      );

    if (!workspace.length) {
      return res.status(404).json({
        msg: "Workspace not found",
      });
    }

    const s3_url =
      workspace[0]?.image_url &&
      (await getS3SignedUrl(workspace[0]?.image_url));

    return res.status(200).json({
      workspace: {
        ...workspace[0],
        image_key: workspace[0]?.image_url,
        image_url: s3_url,
      },
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

export async function putWorkspaceS3ImageUrl(req: Request, res: Response) {
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

    const s3Url = await putS3SignedUrl(key);

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

export async function getWorkspaceS3ImageUrl(req: Request, res: Response) {
  try {
    const { user_id, imageUrl } = req.body;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!imageUrl) {
      return res.status(400).json({
        msg: "Missing image url",
      });
    }

    const s3Url = await getS3SignedUrl(imageUrl);

    return res.status(200).json({
      url: s3Url,
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

export async function joinInWorkspace(req: Request, res: Response) {
  try {
    const { user_id, invite_code } = req.body;
    const { workspaceId } = req.params;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!workspaceId || !invite_code) {
      return res.status(400).json({
        msg: "Missing workspace id or invite code",
      });
    }

    const isWorkspaceAndInviteCodeValid = await db
      .select()
      .from(workspaces)
      .where(
        and(
          eq(workspaces.id, workspaceId),
          eq(workspaces.invite_code, invite_code)
        )
      );

    if (!isWorkspaceAndInviteCodeValid.length) {
      return res.status(404).json({
        msg: "Workspace is not found",
      });
    }

    const isWorkspaceMemberAlreadyAdded = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.user_id, user_id),
          eq(workspaceMembers.workspace_id, workspaceId)
        )
      );

    if (isWorkspaceMemberAlreadyAdded.length) {
      return res.status(400).json({
        msg: "Member already exists",
      });
    }

    const isWorkspaceMemberAdded = await db.insert(workspaceMembers).values({
      user_id,
      workspace_id: workspaceId,
    });

    if (!isWorkspaceMemberAdded) {
      return res.status(400).json({
        msg: "Workspace member not added",
      });
    }

    return res.status(201).json({
      msg: "Member joined to workspace successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function resetInviteCodeForWorkspace(req: Request, res: Response) {
  try {
    const { user_id } = req.body;
    const { workspaceId } = req.params;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    if (!workspaceId) {
      return res.status(400).json({
        msg: "Missing workspace id or invite code",
      });
    }

    const isWorkspaceAndUserValid = await db
      .select()
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaceMembers.workspace_id, workspaces.id))
      .where(
        and(eq(workspaces.user_id, user_id), eq(workspaceMembers.role, "admin"))
      );

    if (!isWorkspaceAndUserValid.length) {
      return res.status(404).json({
        msg: "Workspace is not found",
      });
    }

    const inviteCode = String(Math.floor(Math.random() * 999999));

    const isInviteCodeUpdated = await db
      .update(workspaces)
      .set({
        invite_code: inviteCode,
      })
      .where(eq(workspaces.id, workspaceId));

    if (!isInviteCodeUpdated.rowCount) {
      return res.status(400).json({
        msg: "Invite code updation failed",
      });
    }

    return res.status(201).json({
      msg: "Invite code update successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}
