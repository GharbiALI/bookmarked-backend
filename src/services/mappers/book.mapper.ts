import { BookDocument } from "../../schemas/book.schemas";
import { BookDomain } from "../../domain/book.domain";

export const mapBookEntity = (book: BookDocument): BookDomain => ({
  id: book._id.toString(),
  title: book.title,
  author: book.author,
  genre: book.genre ?? "",
  pages: book.pages,
  status: book.status,
  rating: book.rating,
  userId: book.userId.toString(),
});
