import validator from "validator";

export interface ValidationError {
  field: string;
  message: string;
}

export const validateSignup = (
  username: string,
  email: string,
  password: string,
): ValidationError[] | null => {
  const errors: ValidationError[] = [];

  if (!username || username.trim().length < 3) {
    errors.push({
      field: "username",
      message: "Username must be at least 3 characters",
    });
  }

  if (!email || !validator.isEmail(email)) {
    errors.push({
      field: "email",
      message: "A valid email is required",
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
      message:
        "Password must be at least 12 characters and include uppercase, lowercase, number and symbol",
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
      message: "Username is required",
    });
  }

  if (!password || validator.isEmpty(password.trim())) {
    errors.push({
      field: "password",
      message: "Password is required",
    });
  }

  return errors.length > 0 ? errors : null;
};