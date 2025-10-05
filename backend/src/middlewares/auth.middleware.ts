import type { NextFunction, Request, Response } from "express";
import { verifyJWTToken } from "../utils/jwt.js";

export function verifyUserAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { auth } = req.cookies;

  if (!auth) {
    return res.status(404).json({
      msg: "Auth token not found",
    });
  }

  const { id } = verifyJWTToken(auth);

  if (!id) {
    return res.status(404).json({
      msg: "User id not found",
    });
  }

  req.body = {
    ...req.body,
    user_id: id,
  };
  next();
}
