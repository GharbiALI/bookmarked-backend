import validator from "validator";
import { BookMessages } from "../constants/messages";
import { ValidationError } from "../types/api-responce";

export const validateId = (id: string): ValidationError[] | null => {
  const errors: ValidationError[] = [];

  if (!id || !validator.isMongoId(id)) {
    errors.push({
      field: "id",
      message: BookMessages.INVALID_ID,
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
      message: BookMessages.TITLE_TOO_SHORT,
    });
  }

  if (!author || !validator.isLength(author.trim(), { min: 2 })) {
    errors.push({
      field: "author",
      message: BookMessages.AUTHOR_TOO_SHORT,
    });
  }

  if (
    pages === undefined ||
    pages === null ||
    !validator.isInt(String(pages), { min: 1 })
  ) {
    errors.push({
      field: "pages",
      message: BookMessages.PAGES_INVALID,
    });
  }

  if (
    rating !== undefined &&
    rating !== null &&
    !validator.isFloat(String(rating), { min: 0, max: 5 })
  ) {
    errors.push({
      field: "rating",
      message: BookMessages.RATING_OUT_OF_RANGE,
    });
  }

  return errors.length > 0 ? errors : null;
};