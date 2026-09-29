export const BookMessages = {
  FETCH_SUCCESS: "Books fetched successfully",
  FETCH_ONE_SUCCESS: "Book fetched successfully",
  CREATE_SUCCESS: "Book created successfully",
  UPDATE_SUCCESS: "Book updated successfully",
  DELETE_SUCCESS: "Book deleted successfully",

  NOT_FOUND: "Book not found",
  INVALID_ID: "A valid book id is required",

  FETCH_FAILED: "Failaed to fetch books",
  FETCH_ONE_FAILED: "Failed to fetch book",
  CREATE_FAILED: "Failed to create book",
  UPDATE_FAILED: "Failed to update book",
  DELETE_FAILED: "Failed to delete book",

  TITLE_TOO_SHORT: "Title must be at least 2 characters",
  AUTHOR_TOO_SHORT: "Author must be at least 2 characters",
  PAGES_INVALID: "Pages must be greater than 0",
  RATING_OUT_OF_RANGE: "Rating must be between 0 and 5",
};

export const AuthMessages = {
  SIGNUP_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",

  EMAIL_TAKEN: "A user with this email already exists",
  USERNAME_TAKEN: "Username already taken",
  INVALID_CREDENTIALS: "Invalid username or password",
  NO_TOKEN: "Unauthorized: No token provided",
  INVALID_TOKEN: "Unauthorized: Invalid or expired token",

  SIGNUP_FAILED: "Something went wrong. Please try again later",
  LOGIN_FAILED: "Failed to login",

  USERNAME_TOO_SHORT: "Username must be at least 3 characters",
  EMAIL_INVALID: "A valid email is required",
  PASSWORD_WEAK:
    "Password must be at least 12 characters and include uppercase, lowercase, number and symbol",
  USERNAME_REQUIRED: "Username is required",
  PASSWORD_REQUIRED: "Password is required",
};

export const CommonMessages = {
  VALIDATION_FAILED: "Validation failed",
};
