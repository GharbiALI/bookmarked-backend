import { IBook, Book, BookDocument } from "../schemas/book.schemas";

export const findBooksByUserId = async (
  userId: string,
): Promise<BookDocument[]> => {
  return await Book.find({ userId }).sort({ createdAt: -1 });
};

export const findBookById = async (id: string): Promise<BookDocument | null> => {
  return await Book.findById(id);
};

export const createBook = async (
  bookData: Partial<IBook>,
): Promise<BookDocument> => {
  const book = new Book(bookData);
  return await book.save();
};

export const updateBookById = async (
  id: string,
  bookData: Partial<IBook>,
): Promise<BookDocument | null> => {
  return await Book.findByIdAndUpdate(id, bookData, { new: true });
};

export const deleteBookById = async (
  id: string,
): Promise<BookDocument | null> => {
  return await Book.findByIdAndDelete(id);
};
