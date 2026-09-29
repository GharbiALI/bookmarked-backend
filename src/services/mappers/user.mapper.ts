import { UserDocument } from "../../schemas/user.schemas";
import { UserDomain } from "../../domain/user.domain";

export const mapUserEntity = (user: UserDocument): UserDomain => ({
  id: user._id.toString(),
  username: user.username,
  email: user.email,
});
