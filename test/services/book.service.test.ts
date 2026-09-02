import * as bookRepository from "../../src/repository/book.repository";
import { listBooks } from "../../src/services/book.service";

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
      (bookRepository.findBooksByUserId as jest.Mock).mockResolvedValue(fakeBooks);

      //when
      const result = await listBooks("someUserId");

      //then
      expect(bookRepository.findBooksByUserId).toHaveBeenCalledWith("someUserId");
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

});