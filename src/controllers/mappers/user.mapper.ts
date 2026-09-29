import { UserDomain } from "../../domain/user.domain";
import {
  SignupDto,
  LoginDto,
  UserResponseDto,
  AuthResponseDto,
} from "../../dto/user.dto";

export const mapSignupRequest = (body: SignupDto): SignupDto => ({
  username: body.username,
  email: body.email,
  password: body.password,
});

export const mapLoginRequest = (body: LoginDto): LoginDto => ({
  username: body.username,
  password: body.password,
});

export const mapUserResponse = (user: UserDomain): UserResponseDto => ({
  id: user.id,
  username: user.username,
  email: user.email,
});

export const mapAuthResponse = (
  user: UserDomain,
  token: string,
): AuthResponseDto => ({
  user: mapUserResponse(user),
  token,
});
