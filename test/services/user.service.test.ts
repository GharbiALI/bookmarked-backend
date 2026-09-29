import bcrypt from "bcryptjs";
import * as userRepository from "../../src/repository/user.repository";
import { User } from "../../src/schemas/user.schemas";
import {
  registerUser,
  checkEmailTaken,
  checkUsernameTaken,
  authenticateUser,
} from "../../src/services/user.service";

jest.mock("../../src/repository/user.repository");

const makeUserEntity = (password = "hashed") =>
  new User({ username: "ali", email: "ali@example.com", password });

describe("user.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should hash the password before saving it", async () => {
      //given
      (userRepository.createUser as jest.Mock).mockResolvedValue(
        makeUserEntity(),
      );

      //when
      await registerUser({
        username: "ali",
        email: "ali@example.com",
        password: "Password123!",
      });

      //then
      const savedInput = (userRepository.createUser as jest.Mock).mock
        .calls[0][0];
      expect(savedInput.password).not.toBe("Password123!");
      expect(await bcrypt.compare("Password123!", savedInput.password)).toBe(
        true,
      );
    });

    it("should return a domain object without the password", async () => {
      //given
      const entity = makeUserEntity();
      (userRepository.createUser as jest.Mock).mockResolvedValue(entity);

      //when
      const result = await registerUser({
        username: "ali",
        email: "ali@example.com",
        password: "Password123!",
      });

      //then
      expect(result).toEqual({
        id: entity._id.toString(),
        username: "ali",
        email: "ali@example.com",
      });
      expect(result).not.toHaveProperty("password");
    });
  });

  describe("checkEmailTaken", () => {
    it("should return false when the email is not taken", async () => {
      //given
      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

      //when
      const result = await checkEmailTaken("nobody@example.com");

      //then
      expect(result).toBe(false);
    });

    it("should return true when the email is taken", async () => {
      //given
      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(
        makeUserEntity(),
      );

      //when
      const result = await checkEmailTaken("ali@example.com");

      //then
      expect(result).toBe(true);
    });
  });

  describe("checkUsernameTaken", () => {
    it("should return false when the username is not taken", async () => {
      //given
      (userRepository.findUserByUsername as jest.Mock).mockResolvedValue(null);

      //when
      const result = await checkUsernameTaken("nobody");

      //then
      expect(result).toBe(false);
    });

    it("should return true when the username is taken", async () => {
      //given
      (userRepository.findUserByUsername as jest.Mock).mockResolvedValue(
        makeUserEntity(),
      );

      //when
      const result = await checkUsernameTaken("ali");

      //then
      expect(result).toBe(true);
    });
  });

  describe("authenticateUser", () => {
    it("should return the user as a domain object when the password matches", async () => {
      //given
      const entity = makeUserEntity(bcrypt.hashSync("Password123!", 4));
      (userRepository.findUserByUsername as jest.Mock).mockResolvedValue(
        entity,
      );

      //when
      const result = await authenticateUser({
        username: "ali",
        password: "Password123!",
      });

      //then
      expect(result).toEqual({
        id: entity._id.toString(),
        username: "ali",
        email: "ali@example.com",
      });
      expect(result).not.toHaveProperty("password");
    });

    it("should return null when the password is wrong", async () => {
      //given
      (userRepository.findUserByUsername as jest.Mock).mockResolvedValue(
        makeUserEntity(bcrypt.hashSync("Password123!", 4)),
      );

      //when
      const result = await authenticateUser({
        username: "ali",
        password: "WrongPassword123!",
      });

      //then
      expect(result).toBeNull();
    });

    it("should return null when the user does not exist", async () => {
      //given
      (userRepository.findUserByUsername as jest.Mock).mockResolvedValue(null);

      //when
      const result = await authenticateUser({
        username: "ghost",
        password: "Password123!",
      });

      //then
      expect(result).toBeNull();
    });
  });
});
