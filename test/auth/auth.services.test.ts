import { generateToken, JwtPayload } from "../../src/auth/auth.services";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

describe("Auth Services", () => {
  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      //given
      const userId = new mongoose.Types.ObjectId();
      const username = "ali";

      //when
      const token = generateToken(userId, username);

      //then
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should generate different tokens for different users", () => {
      //given
      const userId1 = new mongoose.Types.ObjectId();
      const userId2 = new mongoose.Types.ObjectId();
      //when
      const token1 = generateToken(userId1, "ali");
      const token2 = generateToken(userId2, "ali");
      //then
      expect(token1).not.toBe(token2);
    });
  });
});
