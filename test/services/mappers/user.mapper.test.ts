import { User } from "../../../src/schemas/user.schemas";
import { mapUserEntity } from "../../../src/services/mappers/user.mapper";

describe("service mapper: mapUserEntity", () => {
  it("should map an entity to a domain object with a string id", () => {
    //given
    const entity = new User({
      username: "ali",
      email: "ali@example.com",
      password: "hashedPassword",
    });

    //when
    const result = mapUserEntity(entity);

    //then
    expect(result).toEqual({
      id: entity._id.toString(),
      username: "ali",
      email: "ali@example.com",
    });
  });

  it("should not carry the password hash into the domain object", () => {
    //given
    const entity = new User({
      username: "ali",
      email: "ali@example.com",
      password: "hashedPassword",
    });

    //when
    const result = mapUserEntity(entity);

    //then
    expect(result).not.toHaveProperty("password");
  });
});
