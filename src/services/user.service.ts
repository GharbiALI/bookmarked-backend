import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "../repository/user.repository";

export const checkEmailTaken = async (email: string) => findUserByEmail(email);

export const checkUsernameTaken = async (username: string) =>
  findUserByUsername(username);

export const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return await createUser({ username, email, password: hashedPassword });
};
