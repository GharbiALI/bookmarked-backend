import * as bookRepository from "../../src/repository/book.repository";
import { listBooks, getBook, addBook, editBook } from "../../src/services/book.service";

jest.mock("../../src/repository/book.repository");

describe("book.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listBooks", () => {
    it("should return the books belonging to the given userId", async () => {
      //given
      const fakeBooks = [
        { title: "Atomic Habits", author: "James Clear" },
        { title: "Deep Work", author: "Cal Newport" },
      ];
      (bookRepository.findBooksByUserId as jest.Mock).mockResolvedValue(
        fakeBooks,
      );

      //when
      const result = await listBooks("someUserId");

      //then
      expect(bookRepository.findBooksByUserId).toHaveBeenCalledWith(
        "someUserId",
      );
      expect(result).toEqual(fakeBooks);
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

  describe("get Book by Id", () => {
    it("should return the book when found", async () => {
      //given
      const fakeBook = { title: "Atomic Habits", author: "James Clear" };
      (bookRepository.findBookById as jest.Mock).mockResolvedValue(fakeBook);

      //when
      const result = await getBook("someBookId");

      //then
      expect(bookRepository.findBookById).toHaveBeenCalledWith("someBookId");
      expect(result).toEqual(fakeBook);
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
    it("should create and return the new book", async () => {
      //given
      const bookData = {
        title: "Clean Code",
        author: "Robert C. Martin",
        pages: 464,
      };
      const fakeCreatedBook = { ...bookData, _id: "someId" };
      (bookRepository.createBook as jest.Mock).mockResolvedValue(
        fakeCreatedBook,
      );

      //when
      const result = await addBook(bookData);

      //then
      expect(bookRepository.createBook).toHaveBeenCalledWith(bookData);
      expect(result).toEqual(fakeCreatedBook);
    });
  });

  describe("editBook", () => {
    it("should update and return the book", async () => {
      //given
      const updates = { title: "Clean Code (2nd ed.)" };
      const fakeUpdatedBook = {
        title: "Clean Code (2nd ed.)",
        author: "Robert C. Martin",
      };
      (bookRepository.updateBookById as jest.Mock).mockResolvedValue(
        fakeUpdatedBook,
      );

      //when
      const result = await editBook("someBookId", updates);

      //then
      expect(bookRepository.updateBookById).toHaveBeenCalledWith(
        "someBookId",
        updates,
      );
      expect(result).toEqual(fakeUpdatedBook);
    });

    it("should return null when the book to update does not exist", async () => {
      //given
      (bookRepository.updateBookById as jest.Mock).mockResolvedValue(null);

      //when
      const result = await editBook("someBookId", { title: "New Title" });

      //then
      expect(result).toBeNull();
    });
  });
});
