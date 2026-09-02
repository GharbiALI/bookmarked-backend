import { IBook } from "../schemas/book.schemas";

export interface BookResponse {
  id: string;
  title: string;
  author: string;
  genre: string;
  pages: number;
  status: string;
  rating: number;
}

export const mapBookResponse = (
  book: IBook & { _id: unknown },
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