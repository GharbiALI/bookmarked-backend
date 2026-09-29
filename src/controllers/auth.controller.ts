import { Request } from "express";
import { Types } from "mongoose";
import {
  registerUser,
  checkEmailTaken,
  checkUsernameTaken,
  authenticateUser,
} from "../services/user.service";
import {
  mapSignupRequest,
  mapLoginRequest,
  mapAuthResponse,
} from "./mappers/user.mapper";
import { AuthResponseDto } from "../dto/user.dto";
import { generateToken } from "../auth/auth.services";
import { HttpStatusCode } from "../constants/http-status";
import { AuthMessages } from "../constants/messages";
import { TypedResponse } from "../types/api-response";

type AuthRes = TypedResponse<AuthResponseDto>;

export const signup = async (req: Request, res: AuthRes): Promise<AuthRes> => {
  try {
    const dto = mapSignupRequest(req.body);

    if (await checkEmailTaken(dto.email)) {
      return res.status(HttpStatusCode.CONFLICT).json({
        success: false,
        message: AuthMessages.EMAIL_TAKEN,
      });
    }

    if (await checkUsernameTaken(dto.username)) {
      return res.status(HttpStatusCode.CONFLICT).json({
        success: false,
        message: AuthMessages.USERNAME_TAKEN,
      });
    }

    const user = await registerUser(dto);
    const token = generateToken(new Types.ObjectId(user.id), user.username);

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
    const user = await authenticateUser(mapLoginRequest(req.body));

    if (!user) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: AuthMessages.INVALID_CREDENTIALS,
      });
    }

    const token = generateToken(new Types.ObjectId(user.id), user.username);

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
