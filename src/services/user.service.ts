import bcrypt from "bcryptjs";
import { UserDomain } from "../domain/user.domain";
import { SignupDto, LoginDto } from "../dto/user.dto";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "../repository/user.repository";
import { mapUserEntity } from "./mappers/user.mapper";

const SALT = 12;

export const checkEmailTaken = async (email: string): Promise<boolean> =>
  (await findUserByEmail(email)) !== null;

export const checkUsernameTaken = async (username: string): Promise<boolean> =>
  (await findUserByUsername(username)) !== null;

export const registerUser = async (dto: SignupDto): Promise<UserDomain> => {
  const hashedPassword = await bcrypt.hash(dto.password, SALT);
  const user = await createUser({
    username: dto.username,
    email: dto.email,
    password: hashedPassword,
  });
  return mapUserEntity(user);
};

export const authenticateUser = async (
  dto: LoginDto,
): Promise<UserDomain | null> => {
  const user = await findUserByUsername(dto.username);

  const isMatch = user
    ? await bcrypt.compare(dto.password, user.password)
    : false;

  return isMatch ? mapUserEntity(user!) : null;
};

