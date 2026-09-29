import { IUser, User, UserDocument } from "../schemas/user.schemas";

export const createUser = async (
  userData: Partial<IUser>,
): Promise<UserDocument> => {
  const user = new User(userData);
  return await user.save();
};

export const findUserByEmail = async (
  email: string,
): Promise<UserDocument | null> => {
  return await User.findOne({ email });
};

export const findUserByUsername = async (
  username: string,
): Promise<UserDocument | null> => {
  return await User.findOne({ username });
};
