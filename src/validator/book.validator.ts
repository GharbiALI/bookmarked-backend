import validator from "validator";
import { ValidationError } from "./user.validator";

export const validateId = (id: string): ValidationError[] | null => {
  const errors: ValidationError[] = [];

  if (!id || !validator.isMongoId(id)) {
    errors.push({
      field: "id",
      message: "A valid book id is required",
    });
  }

  return errors.length > 0 ? errors : null;
};

export const validateBook = (
  title: string,
  author: string,
  pages: number,
  rating: number,
): ValidationError[] | null => {
  const errors: ValidationError[] = [];

  if (!title || !validator.isLength(title.trim(), { min: 2 })) {
    errors.push({
      field: "title",
      message: "Title must be at least 2 characters",
    });
  }

  if (!author || !validator.isLength(author.trim(), { min: 2 })) {
    errors.push({
      field: "author",
      message: "Author must be at least 2 characters",
    });
  }

  if (
    pages === undefined ||
    pages === null ||
    !validator.isInt(String(pages), { min: 1 })
  ) {
    errors.push({
      field: "pages",
      message: "Pages must be greater than 0",
    });
  }

  if (
    rating !== undefined &&
    rating !== null &&
    !validator.isFloat(String(rating), { min: 0, max: 5 })
  ) {
    errors.push({
      field: "rating",
      message: "Rating must be between 0 and 5",
    });
  }

  return errors.length > 0 ? errors : null;
};