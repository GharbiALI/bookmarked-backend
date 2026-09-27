import { Types } from "mongoose";
import { IUser } from "../schemas/user.schemas";

export interface UserResponse {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

export const mapAuthResponse = (
  user: IUser & { _id: Types.ObjectId },
  token: string,
): AuthResponse => {
  return {
    user: {
      id: String(user._id),
      username: user.username,
      email: user.email,
    },
    token,
  };
};