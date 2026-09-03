import { Types } from "mongoose";
import { IBook, Book } from "../schemas/book.schemas";

export const findBooksByUserId = async (
  userId: string,
): Promise<(IBook & { _id: Types.ObjectId })[]> => {
  return await Book.find({ userId }).sort({ createdAt: -1 });
};

export const findBookById = async (
  id: string,
): Promise<(IBook & { _id: Types.ObjectId }) | null> => {
  return await Book.findById(id);
};

export const createBook = async (bookData: Partial<IBook>): Promise<IBook> => {
  const book = new Book(bookData);
  return await book.save();
};

export const updateBookById = async (
  id: string,
  bookData: Partial<IBook>,
): Promise<(IBook & { _id: Types.ObjectId }) | null> => {
  return await Book.findByIdAndUpdate(id, bookData, { new: true });
};