import { Types } from "mongoose";
import { IBook, ReadStatus } from "../schemas/book.schemas";

export interface BookResponse {
  id: string;
  title: string;
  author: string;
  genre: string;
  pages: number;
  status: ReadStatus;
  rating: number;
}

export const mapBookResponse = (
  book: IBook & { _id: Types.ObjectId },
): BookResponse => {
  return {
    id: String(book._id),
    title: book.title,
    author: book.author,
    genre: book.genre ?? "",
    pages: book.pages,
    status: book.status,
    rating: book.rating,
  };
};

export const mapBooksResponse = (
  books: (IBook & { _id: Types.ObjectId })[],
): BookResponse[] => books.map(mapBookResponse);