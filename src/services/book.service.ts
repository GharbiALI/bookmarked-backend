import { IBook } from "../schemas/book.schemas";
import {
  findBooksByUserId,
  findBookById,
  createBook,
  updateBookById,
  deleteBookById
} from "../repository/book.repository";

export const listBooks = async (userId: string) => findBooksByUserId(userId);

export const getBook = async (id: string) => findBookById(id);

export const addBook = async (bookData: Partial<IBook>) => createBook(bookData);

export const editBook = async (id: string, bookData: Partial<IBook>) => updateBookById(id, bookData);

export const removeBook = async (id: string) => deleteBookById(id);
