import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import {listBooks} from "../services/book.service"
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