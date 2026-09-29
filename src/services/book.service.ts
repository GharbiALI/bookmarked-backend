import { Types } from "mongoose";
import { BookDomain } from "../domain/book.domain";
import { CreateBookDto, UpdateBookDto } from "../dto/book.dto";
import {
  findBooksByUserId,
  findBookById,
  createBook,
  updateBookById,
  deleteBookById,
} from "../repository/book.repository";
import { mapBookEntity } from "./mappers/book.mapper";

export const listBooks = async (userId: string): Promise<BookDomain[]> => {
  const books = await findBooksByUserId(userId);

  return books.map(mapBookEntity);
};

export const getBook = async (id: string): Promise<BookDomain | null> => {
  const book = await findBookById(id);

  return book ? mapBookEntity(book) : null;
};

export const addBook = async (
  dto: CreateBookDto,
  userId: string,
): Promise<BookDomain> => {
  const book = await createBook({
    ...dto,
    userId: new Types.ObjectId(userId),
  });

  return mapBookEntity(book);
};

export const editBook = async (
  id: string,
  dto: UpdateBookDto,
): Promise<BookDomain | null> => {
  const book = await updateBookById(id, dto);

  return book ? mapBookEntity(book) : null;
};

export const removeBook = async (id: string): Promise<BookDomain | null> => {
  const book = await deleteBookById(id);

  return book ? mapBookEntity(book) : null;
};
