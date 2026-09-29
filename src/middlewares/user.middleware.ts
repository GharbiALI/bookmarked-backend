import { Request, NextFunction } from "express";
import { validateSignup, validateLogin } from "../validator/user.validator";
import { HttpStatusCode } from "../constants/http-status";
import { CommonMessages } from "../constants/messages";
import { TypedResponse } from "../types/api-response";

export const validateSignupMiddleware = (
  req: Request,
  res: TypedResponse<never>,
  next: NextFunction,
): void => {
  const { username, email, password } = req.body;
  const errors = validateSignup(username, email, password);

  if (errors) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      success: false,
      message: CommonMessages.VALIDATION_FAILED,
      errors,
    });
    return;
  }

  next();
};

export const validateLoginMiddleware = (
  req: Request,
  res: TypedResponse<never>,
  next: NextFunction,
): void => {
  const { username, password } = req.body;
  const errors = validateLogin(username, password);

  if (errors) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      success: false,
      message: CommonMessages.VALIDATION_FAILED,
      errors,
    });
    return;
  }

  next();
};