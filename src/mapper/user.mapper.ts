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
  user: IUser & { _id: unknown },
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