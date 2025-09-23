import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "Required fields are missing" });
    }
  };
