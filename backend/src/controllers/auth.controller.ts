import type { Request, Response } from "express";
import { users, workspaceMembers } from "../db/schema.js";
import { db } from "../db/index.js";
import { count, eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import type { UserSignin, UserSignup } from "../utils/types.js";
import { createJWTToken, verifyJWTToken } from "../utils/jwt.js";

export async function signupUser(req: Request, res: Response) {
  try {
    const newUser: UserSignup = req.body;

    const isEmailExists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, newUser.email))
      .limit(1);

    if (isEmailExists.length) {
      return res.status(403).json({
        msg: "User email already exists",
      });
    }

    const encryptedPassword = await bcrypt.hash(newUser.password, 10);

    const isUserCreated = await db.insert(users).values({
      ...newUser,
      password: encryptedPassword,
    });

    if (!isUserCreated.rowCount) {
      return res.status(500).json({
        msg: "User creation unsuccessful",
      });
    }

    return res.status(201).json({
      msg: "User created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function signinUser(req: Request, res: Response) {
  try {
    const signinUser: UserSignin = req.body;

    const isUserExist = await db
      .select({ id: users.id, password: users.password })
      .from(users)
      .where(eq(users.email, signinUser.email))
      .limit(1);

    if (!isUserExist.length) {
      return res.status(404).json({
        msg: "Email or password is wrong",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      signinUser.password,
      isUserExist[0]?.password || ""
    );

    if (!isPasswordCorrect) {
      return res.status(404).json({
        msg: "Email or password is wrong",
      });
    }

    const accessToken = createJWTToken(isUserExist[0]?.id || "");

    res.cookie("auth", accessToken, {
      maxAge: 9000000, // 150 minutes
      httpOnly: true,
      // secure: true, // Only send over HTTPS
      // sameSite: "none",
      // path: "/*",
    });

    return res.status(200).json({
      msg: "User signin successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function signoutUser(req: Request, res: Response) {
  try {
    return res.status(200).clearCookie("auth").json({
      msg: "User signout successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(404).json({
        msg: "User id not found",
      });
    }

    const isUserExists = await db
      .select({
        id: users.id,
        name: users.name,
        // workspaceCount: count(workspaceMembers.workspace_id),
      })
      .from(users)
      // .leftJoin(workspaceMembers, eq(workspaceMembers.user_id, users.id))
      .where(eq(users.id, user_id));
    // .groupBy(users.id);

    if (!isUserExists.length) {
      return res.status(404).json({
        msg: "User does not exist",
      });
    }

    return res.status(200).json({
      msg: "Get current user successfully",
      user: isUserExists[0],
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}
