import * as userRepository from "../../src/repository/user.repository";
import {
  registerUser,
  checkEmailTaken,
  checkUsernameTaken,
} from "../../src/services/user.service";

jest.mock("../../src/repository/user.repository");

describe("signup.service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("should call createUser", async () => {
    //given
    (userRepository.createUser as jest.Mock).mockResolvedValue({
      username: "ali",
      email: "ali@example.com",
      password: "hashed",
    });
    //when
    await registerUser("ali", "ali@example.com", "Password123!");
    //then
    expect(userRepository.createUser).toHaveBeenCalledTimes(1);
  });

  it("should return null when email is not taken", async () => {
    //given
    (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);
    //when
    const result = await checkEmailTaken("nobody@example.com");
    //then
    expect(result).toBeNull();
  });

  it("should return the user when username is taken", async () => {
    //given
    const fakeUser = {
      username: "alice",
      email: "alice@example.com",
      password: "hashed",
    };

    (userRepository.findUserByUsername as jest.Mock).mockResolvedValue(fakeUser);
    //when
    const result = await checkUsernameTaken("alice");
    //then
    expect(result).toEqual(fakeUser);
  });

});
