import { findBooksByUserId } from "../repository/book.repository";

export const listBooks = async (userId: string) => findBooksByUserId(userId);