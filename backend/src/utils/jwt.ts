import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY!;

export function createJWTToken(id: string) {
  return jwt.sign(JSON.stringify({ id }), JWT_KEY);
}

export function verifyJWTToken(token: string) {
  return jwt.verify(token, JWT_KEY) as { id: string };
}
