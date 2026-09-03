import { Request, Response, NextFunction } from "express";
import { validateId, validateBook } from "../validator/book.validator";

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

export const validateBookMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, author, pages, rating } = req.body;
  const errors = validateBook(title, author, pages, rating);

  if (errors) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};