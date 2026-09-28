import { Request } from "express";
import bcrypt from "bcryptjs";
import {
  registerUser,
  checkEmailTaken,
  getUserByUsername,
} from "../services/user.service";
import { mapAuthResponse, AuthResponse } from "../mapper/user.mapper";
import { generateToken } from "../auth/auth.services";
import { HttpStatusCode } from "../constants/http-status";
import { AuthMessages } from "../constants/messages";
import { TypedResponse } from "../types/api-response";

type AuthRes = TypedResponse<AuthResponse>;

export const signup = async (req: Request, res: AuthRes): Promise<AuthRes> => {
  try {
    const { username, email, password } = req.body;

    const existingEmail = await checkEmailTaken(email);
    if (existingEmail) {
      return res.status(HttpStatusCode.CONFLICT).json({
        success: false,
        message: AuthMessages.EMAIL_TAKEN,
      });
    }

    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return res.status(HttpStatusCode.CONFLICT).json({
        success: false,
        message: AuthMessages.USERNAME_TAKEN,
      });
    }

    const user = await registerUser(username, email, password);
    const token = generateToken(user._id, user.username);

    return res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: AuthMessages.SIGNUP_SUCCESS,
      data: mapAuthResponse(user, token),
    });
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: AuthMessages.SIGNUP_FAILED,
    });
  }
};

export const login = async (req: Request, res: AuthRes): Promise<AuthRes> => {
  try {
    const { username, password } = req.body;

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: AuthMessages.INVALID_CREDENTIALS,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: AuthMessages.INVALID_CREDENTIALS,
      });
    }

    const token = generateToken(user._id, user.username);

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: AuthMessages.LOGIN_SUCCESS,
      data: mapAuthResponse(user, token),
    });
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: AuthMessages.LOGIN_FAILED,
    });
  }
};
