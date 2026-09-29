import validator from "validator";
import { AuthMessages } from "../constants/messages";
import { ValidationError } from "../types/api-response";

export const validateSignup = (
  username: string,
  email: string,
  password: string,
): ValidationError[] | null => {
  const errors: ValidationError[] = [];

  if (!username || username.trim().length < 3) {
    errors.push({
      field: "username",
      message: AuthMessages.USERNAME_TOO_SHORT,
    });
  }

  if (!email || !validator.isEmail(email)) {
    errors.push({
      field: "email",
      message: AuthMessages.EMAIL_INVALID,
    });
  }

  if (
    !password ||
    !validator.isStrongPassword(password, {
      minLength: 12,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    errors.push({
      field: "password",
      message: AuthMessages.PASSWORD_WEAK,
    });
  }

  return errors.length > 0 ? errors : null;
};

export const validateLogin = (
  username: string,
  password: string,
): ValidationError[] | null => {
  const errors: ValidationError[] = [];

  if (!username || validator.isEmpty(username.trim())) {
    errors.push({
      field: "username",
      message: AuthMessages.USERNAME_REQUIRED,
    });
  }

  if (!password || validator.isEmpty(password.trim())) {
    errors.push({
      field: "password",
      message: AuthMessages.PASSWORD_REQUIRED,
    });
  }

  return errors.length > 0 ? errors : null;
};