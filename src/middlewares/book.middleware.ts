import { Request, NextFunction } from "express";
import { validateId, validateBook } from "../validator/book.validator";
import { HttpStatusCode } from "../constants/http-status";
import { CommonMessages } from "../constants/messages";
import { TypedResponse } from "../types/api-response";

export const validateIdMiddleware = (
  req: Request,
  res: TypedResponse<never>,
  next: NextFunction,
): void => {
  const { id } = req.params;
  const errors = validateId(id);

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

export const validateBookMiddleware = (
  req: Request,
  res: TypedResponse<never>,
  next: NextFunction,
): void => {
  const { title, author, pages, rating } = req.body;
  const errors = validateBook(title, author, pages, rating);

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
