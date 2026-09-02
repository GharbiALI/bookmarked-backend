import { Request, Response, NextFunction } from "express";
import { validateId } from "../validator/book.validator";

export const validateIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const errors = validateId(id);

  if (errors) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};