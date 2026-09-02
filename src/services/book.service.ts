import { findBooksByUserId, findBookById } from "../repository/book.repository";

export const listBooks = async (userId: string) => findBooksByUserId(userId);

export const getBook = async (id: string) => findBookById(id);