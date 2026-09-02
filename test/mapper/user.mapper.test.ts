import { mapAuthResponse } from "../../src/mapper/user.mapper";
import { IUser } from "../../src/schemas/user.schemas";

describe("mapAuthResponse", () => {

    it("should map user object and token to response with required fields", () => {
      //given
      const mockUser: IUser & { _id: unknown } = {
        _id: "64f1a2b3c4d5e6f7a8b9c0d1",
        username: "ali",
        email: "ali@example.com",
        password: "hashedPassword",
      };
      const token = "fakeToken";

      //when
      const result = mapAuthResponse(mockUser, token);

      //then
      expect(result.user.id).toBe(String(mockUser._id));
      expect(result.user.username).toBe(mockUser.username);
      expect(result.user.email).toBe(mockUser.email);
      expect(result.token).toBe(token);
    });

    it("should not include password in mapped response", () => {
      //given
      const mockUser: IUser & { _id: unknown } = {
        _id: "64f1a2b3c4d5e6f7a8b9c0d2",
        username: "testuser",
        email: "test@example.com",
        password: "secretPassword",
      };
      const token = "anotherFakeToken";

      //when
      const result = mapAuthResponse(mockUser, token);

      //then
      expect(result.user).not.toHaveProperty("password");
    });
  });