import { Types } from "mongoose";
import * as bookRepository from "../../src/repository/book.repository";
import { Book } from "../../src/schemas/book.schemas";
import {
  listBooks,
  getBook,
  addBook,
  editBook,
  removeBook,
} from "../../src/services/book.service";

jest.mock("../../src/repository/book.repository");

const makeBookEntity = (overrides: Partial<Record<string, unknown>> = {}) =>
  new Book({
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-help",
    pages: 320,
    status: "to-read",
    rating: 0,
    userId: new Types.ObjectId(),
    ...overrides,
  });

describe("book.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listBooks", () => {
    it("should return domain objects, not database entities", async () => {
      //given
      const entity = makeBookEntity();
      (bookRepository.findBooksByUserId as jest.Mock).mockResolvedValue([
        entity,
      ]);

      //when
      const result = await listBooks("someUserId");

      //then
      expect(bookRepository.findBooksByUserId).toHaveBeenCalledWith(
        "someUserId",
      );
      expect(result).toEqual([
        {
          id: entity._id.toString(),
          title: "Atomic Habits",
          author: "James Clear",
          genre: "Self-help",
          pages: 320,
          status: "to-read",
          rating: 0,
          userId: entity.userId.toString(),
        },
      ]);
      expect(result[0]).not.toBeInstanceOf(Book);
      expect(result[0]).not.toHaveProperty("_id");
    });

    it("should return an empty array when the user has no books", async () => {
      //given
      (bookRepository.findBooksByUserId as jest.Mock).mockResolvedValue([]);

      //when
      const result = await listBooks("someUserId");

      //then
      expect(result).toEqual([]);
    });
  });

  describe("getBook", () => {
    it("should return the book as a domain object when found", async () => {
      //given
      const entity = makeBookEntity();
      (bookRepository.findBookById as jest.Mock).mockResolvedValue(entity);

      //when
      const result = await getBook("someBookId");

      //then
      expect(bookRepository.findBookById).toHaveBeenCalledWith("someBookId");
      expect(result?.id).toBe(entity._id.toString());
      expect(result?.userId).toBe(entity.userId.toString());
      expect(result).not.toBeInstanceOf(Book);
    });

    it("should return null when the book is not found", async () => {
      //given
      (bookRepository.findBookById as jest.Mock).mockResolvedValue(null);

      //when
      const result = await getBook("someBookId");

      //then
      expect(result).toBeNull();
    });
  });

  describe("addBook", () => {
    it("should convert the userId to an ObjectId, save, and return a domain object", async () => {
      //given
      const userId = new Types.ObjectId().toString();
      const dto = { title: "Clean Code", author: "Robert C. Martin", pages: 464 };
      const saved = makeBookEntity({ ...dto, userId: new Types.ObjectId(userId) });
      (bookRepository.createBook as jest.Mock).mockResolvedValue(saved);

      //when
      const result = await addBook(dto, userId);

      //then
      const savedInput = (bookRepository.createBook as jest.Mock).mock
        .calls[0][0];
      expect(savedInput).toMatchObject(dto);
      expect(savedInput.userId).toBeInstanceOf(Types.ObjectId);
      expect(savedInput.userId.toString()).toBe(userId);
      expect(result.id).toBe(saved._id.toString());
      expect(result.userId).toBe(userId);
      expect(result).not.toBeInstanceOf(Book);
    });
  });

  describe("editBook", () => {
    it("should update and return the book as a domain object", async () => {
      //given
      const dto = { title: "Clean Code (2nd ed.)", author: "Robert C. Martin", pages: 464 };
      const updated = makeBookEntity(dto);
      (bookRepository.updateBookById as jest.Mock).mockResolvedValue(updated);

      //when
      const result = await editBook("someBookId", dto);

      //then
      expect(bookRepository.updateBookById).toHaveBeenCalledWith(
        "someBookId",
        dto,
      );
      expect(result?.title).toBe("Clean Code (2nd ed.)");
      expect(result).not.toBeInstanceOf(Book);
    });

    it("should return null when the book to update does not exist", async () => {
      //given
      (bookRepository.updateBookById as jest.Mock).mockResolvedValue(null);

      //when
      const result = await editBook("someBookId", {
        title: "New Title",
        author: "Someone",
        pages: 10,
      });

      //then
      expect(result).toBeNull();
    });
  });

  describe("removeBook", () => {
    it("should delete and return the removed book as a domain object", async () => {
      //given
      const entity = makeBookEntity();
      (bookRepository.deleteBookById as jest.Mock).mockResolvedValue(entity);

      //when
      const result = await removeBook("someBookId");

      //then
      expect(bookRepository.deleteBookById).toHaveBeenCalledWith("someBookId");
      expect(result?.id).toBe(entity._id.toString());
      expect(result).not.toBeInstanceOf(Book);
    });

    it("should return null when the book to delete does not exist", async () => {
      //given
      (bookRepository.deleteBookById as jest.Mock).mockResolvedValue(null);

      //when
      const result = await removeBook("someBookId");

      //then
      expect(result).toBeNull();
    });
  });
});
