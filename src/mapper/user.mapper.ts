import { IUser } from "../schemas/user.schemas";

export interface UserResponse {
  id: string;
  username: string;
  email: string;
}

export interface SignupResponse {
  user: UserResponse;
  token: string;
}

export const mapSignupResponse = (
  user: IUser & { _id: unknown },
  token: string,
): SignupResponse => {
  return {
    user: {
      id: String(user._id),
      username: user.username,
      email: user.email,
    },
    token,
  };
};