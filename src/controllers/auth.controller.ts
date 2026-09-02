import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
  registerUser,
  checkEmailTaken,
  getUserByUsername ,
} from "../services/user.service";
import { mapAuthResponse  } from "../mapper/user.mapper";
import { generateToken } from "../auth/auth.services";
import { IUser } from "../schemas/user.schemas";

type UserDoc = IUser & { _id: any };

export const signup = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { username, email, password } = req.body;

    const existingEmail = await checkEmailTaken(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const existingUsername = await getUserByUsername (username);
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username already taken",
      });
    }

    const user = (await registerUser(username, email, password)) as UserDoc;
    const token = generateToken(user._id, user.username);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: mapAuthResponse(user, token),
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { username, password } = req.body;

    const user = (await getUserByUsername(username)) as UserDoc | null;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = generateToken(user._id, user.username);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: mapAuthResponse(user, token),
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};
