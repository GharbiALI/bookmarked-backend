import { AuthRequest } from "../auth/auth.middleware";
import {
  listBooks,
  getBook,
  addBook,
  editBook,
  removeBook,
} from "../services/book.service";
import {
  mapCreateBookRequest,
  mapUpdateBookRequest,
  mapBookResponse,
  mapBooksResponse,
} from "./mappers/book.mapper";
import { BookResponseDto } from "../dto/book.dto";
import { HttpStatusCode } from "../constants/http-status";
import { BookMessages } from "../constants/messages";
import { TypedResponse } from "../types/api-response";

export const listBooksHandler = async (
  req: AuthRequest,
  res: TypedResponse<BookResponseDto[]>,
): Promise<TypedResponse<BookResponseDto[]>> => {
  try {
    const books = await listBooks(req.user!.userId);

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: BookMessages.FETCH_SUCCESS,
      data: mapBooksResponse(books),
    });
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: BookMessages.FETCH_FAILED,
    });
  }
};

export const getBookHandler = async (
  req: AuthRequest,
  res: TypedResponse<BookResponseDto>,
): Promise<TypedResponse<BookResponseDto>> => {
  try {
    const book = await getBook(req.params.id);

    if (!book || book.userId !== req.user!.userId) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: BookMessages.NOT_FOUND,
      });
    }

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: BookMessages.FETCH_ONE_SUCCESS,
      data: mapBookResponse(book),
    });
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: BookMessages.FETCH_ONE_FAILED,
    });
  }
};

export const createBookHandler = async (
  req: AuthRequest,
  res: TypedResponse<BookResponseDto>,
): Promise<TypedResponse<BookResponseDto>> => {
  try {
    const book = await addBook(
      mapCreateBookRequest(req.body),
      req.user!.userId,
    );

    return res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: BookMessages.CREATE_SUCCESS,
      data: mapBookResponse(book),
    });
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: BookMessages.CREATE_FAILED,
    });
  }
};

export const updateBookHandler = async (
  req: AuthRequest,
  res: TypedResponse<BookResponseDto>,
): Promise<TypedResponse<BookResponseDto>> => {
  try {
    const existing = await getBook(req.params.id);

    if (!existing || existing.userId !== req.user!.userId) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: BookMessages.NOT_FOUND,
      });
    }

    const updated = await editBook(
      req.params.id,
      mapUpdateBookRequest(req.body),
    );

    // The book can be deleted between the ownership check and the update.
    if (!updated) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: BookMessages.NOT_FOUND,
      });
    }

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: BookMessages.UPDATE_SUCCESS,
      data: mapBookResponse(updated),
    });
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: BookMessages.UPDATE_FAILED,
    });
  }
};

export const deleteBookHandler = async (
  req: AuthRequest,
  res: TypedResponse<{ id: string }>,
): Promise<TypedResponse<{ id: string }>> => {
  try {
    const existing = await getBook(req.params.id);

    if (!existing || existing.userId !== req.user?.userId) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: BookMessages.NOT_FOUND,
      });
    }

    await removeBook(req.params.id);

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: BookMessages.DELETE_SUCCESS,
      data: { id: req.params.id },
    });
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: BookMessages.DELETE_FAILED,
    });
  }
};
