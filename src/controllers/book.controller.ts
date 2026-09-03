import { Types } from "mongoose";
import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import { listBooks, getBook, addBook } from "../services/book.service";
import { mapBookResponse } from "../mapper/book.mapper";

export const listBooksHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user!.userId;

    const books = await listBooks(userId);

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: books.map(mapBookResponse),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
};

export const getBookHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const book = await getBook(req.params.id);

    if (!book || book.userId.toString() !== req.user!.userId) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      data: mapBookResponse(book),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch book",
    });
  }
};

export const createBookHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId = new Types.ObjectId(req.user!.userId);
    const { title, author, genre, pages, status, rating } = req.body;

    const book = await addBook({
      title,
      author,
      genre,
      pages,
      status,
      rating,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: mapBookResponse(book as typeof book & { _id: unknown }),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create book",
    });
  }
};
