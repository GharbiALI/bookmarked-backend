import {
  mapSignupRequest,
  mapLoginRequest,
  mapUserResponse,
  mapAuthResponse,
} from "../../../src/controllers/mappers/user.mapper";
import { UserDomain } from "../../../src/domain/user.domain";

const domain: UserDomain = {
  id: "64f1a2b3c4d5e6f7a8b9c0d1",
  username: "ali",
  email: "ali@example.com",
};

describe("controller mapper: user", () => {
  it("should keep only the signup fields from the request body", () => {
    //given
    const body = {
      username: "ali",
      email: "ali@example.com",
      password: "Password123!",
      role: "admin",
    };

    //when
    const result = mapSignupRequest(body);

    //then
    expect(result).toEqual({
      username: "ali",
      email: "ali@example.com",
      password: "Password123!",
    });
  });

  it("should keep only the login fields from the request body", () => {
    //given
    const body = { username: "ali", password: "Password123!", extra: true };

    //when
    const result = mapLoginRequest(body);

    //then
    expect(result).toEqual({ username: "ali", password: "Password123!" });
  });

  it("should map a domain user to the user response DTO", () => {
    //when
    const result = mapUserResponse(domain);

    //then
    expect(result).toEqual(domain);
  });

  it("should combine the user and token into the auth response DTO", () => {
    //when
    const result = mapAuthResponse(domain, "fakeToken");

    //then
    expect(result).toEqual({ user: domain, token: "fakeToken" });
    expect(result.user).not.toHaveProperty("password");
  });
});
