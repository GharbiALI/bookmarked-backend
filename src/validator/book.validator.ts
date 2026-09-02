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