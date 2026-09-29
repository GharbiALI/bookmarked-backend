import { BookDomain } from "../../domain/book.domain";
import {
  CreateBookDto,
  UpdateBookDto,
  BookResponseDto,
} from "../../dto/book.dto";

// Picks only the fields a client is allowed to send.
export const mapCreateBookRequest = (body: CreateBookDto): CreateBookDto => ({
  title: body.title,
  author: body.author,
  genre: body.genre,
  pages: body.pages,
  status: body.status,
  rating: body.rating,
});

export const mapUpdateBookRequest = (body: UpdateBookDto): UpdateBookDto => ({
  title: body.title,
  author: body.author,
  genre: body.genre,
  pages: body.pages,
  status: body.status,
  rating: body.rating,
});

export const mapBookResponse = (book: BookDomain): BookResponseDto => ({
  id: book.id,
  title: book.title,
  author: book.author,
  genre: book.genre,
  pages: book.pages,
  status: book.status,
  rating: book.rating,
});

export const mapBooksResponse = (books: BookDomain[]): BookResponseDto[] =>
  books.map(mapBookResponse);
