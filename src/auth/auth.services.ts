import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;
const jwtExpiresIn = process.env.jwtExpiresIn;

export interface JwtPayload {
  userId: string;
  username: string;
}

export const generateToken = (
  userId: Types.ObjectId,
  username: string,
): string => {
  return jwt.sign({ userId: userId.toString(), username }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, jwtSecret) as JwtPayload;
};
