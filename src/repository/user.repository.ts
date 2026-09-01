import { IUser, User } from "../schemas/user.schemas";

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

export const findUserByUsername = async (
  username: string,
): Promise<IUser | null> => {
  return await User.findOne({ username });
};
