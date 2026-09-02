import { Types } from "mongoose";
import { IBook, Book } from "../schemas/book.schemas";

export const findBooksByUserId = async (
  userId: string,
): Promise<(IBook & { _id: Types.ObjectId })[]> => {
  return await Book.find({ userId }).sort({ createdAt: -1 });
};