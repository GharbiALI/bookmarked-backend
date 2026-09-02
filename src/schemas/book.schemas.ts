import { Schema, model, Types } from "mongoose";

export type ReadStatus = "reading" | "to-read" | "finished";

export interface IBook {
  title: string;
  author: string;
  genre?: string;
  pages: number;
  status: ReadStatus;
  rating: number;
  userId: Types.ObjectId;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    author: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    genre: {
      type: String,
      trim: true,
      default: "",
    },

    pages: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["reading", "to-read", "finished"],
      default: "to-read",
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Book = model<IBook>("Book", bookSchema);