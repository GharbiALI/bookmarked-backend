import { Request, Response, NextFunction } from "express";
import { validateSignup,validateLogin } from "../validator/user.validator";

export const validateSignupMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, email, password } = req.body;
  const errors = validateSignup(username, email, password);

  if (errors) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const validateLoginMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, password } = req.body;
  const errors = validateLogin(username, password);

  if (errors) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};