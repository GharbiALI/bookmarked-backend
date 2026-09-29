import { Request, NextFunction } from "express";
import { verifyToken, JwtPayload } from "./auth.services";
import { HttpStatusCode } from "../constants/http-status";
import { AuthMessages } from "../constants/messages";
import { TypedResponse } from "../types/api-response";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (
  req: AuthRequest,
  res: TypedResponse<never>,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      success: false,
      message: AuthMessages.NO_TOKEN,
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      success: false,
      message: AuthMessages.INVALID_TOKEN,
    });
  }
};
