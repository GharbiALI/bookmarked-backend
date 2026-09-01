import { Schema, model } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 12,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("User", userSchema);
