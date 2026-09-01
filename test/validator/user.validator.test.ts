import { validateSignup } from "../../src/validator/user.validator";

describe("Signup Validator", () => {
  describe("validateSignup", () => {

    it("should return null when all inputs are valid", () => {
      //given
      const username = "ali";
      const email = "ali@example.com";
      const password = "StrongPass123!";

      //when
      const result = validateSignup(username, email, password);

      //then
      expect(result).toBeNull();
    });

    it("should return error when username is too short", () => {
      //given
      const username = "al";
      const email = "ali@example.com";
      const password = "StrongPass123!";

      //when
      const result = validateSignup(username, email, password);

      //then
      expect(result).toContainEqual({
        field: "username",
        message: "Username must be at least 3 characters",
      });
    });

    it("should return error when username is empty", () => {
      //given
      const username = "";
      const email = "john@example.com";
      const password = "StrongPass123!";

      //when
      const result = validateSignup(username, email, password);

      //then
      expect(result).toContainEqual({
        field: "username",
        message: "Username must be at least 3 characters",
      });
    });

    it("should return error when email is invalid", () => {
      //given
      const username = "johndoe";
      const email = "invalid-email";
      const password = "StrongPass123!";

      //when
      const result = validateSignup(username, email, password);

      //then
      expect(result).toContainEqual({
        field: "email",
        message: "A valid email is required",
      });
    });

    it("should return error when email is empty", () => {
      //given
      const username = "johndoe";
      const email = "";
      const password = "StrongPass123!";

      //when
      const result = validateSignup(username, email, password);

      //then
      expect(result).toContainEqual({
        field: "email",
        message: "A valid email is required",
      });
    });

    it("should return error when password is not strong enough", () => {
      //given
      const username = "johndoe";
      const email = "john@example.com";
      const password = "weakpass";

      //when
      const result = validateSignup(username, email, password);

      //then
      expect(result).toContainEqual({
        field: "password",
        message:
          "Password must be at least 12 characters and include uppercase, lowercase, number and symbol",
      });
    });

    it("should return error when password is empty", () => {
      //given
      const username = "johndoe";
      const email = "john@example.com";
      const password = "";

      //when
      const result = validateSignup(username, email, password);

      //then
      expect(result).toContainEqual({
        field: "password",
        message:
          "Password must be at least 12 characters and include uppercase, lowercase, number and symbol",
      });
    });

    it("should return multiple errors when multiple fields are invalid", () => {
      //given
      const username = "";
      const email = "invalid-email";
      const password = "short";

      //when
      const result = validateSignup(username, email, password);

      //then
      expect(result).toHaveLength(3);
    });

  });
});
