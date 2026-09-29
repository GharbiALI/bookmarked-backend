import { validateId, validateBook } from "../../src/validator/book.validator";

describe("Book Validator", () => {
  describe("validateId", () => {

    it("should return null when the id is a valid MongoDB ObjectId", () => {
      //given
      const id = "64f1a2b3c4d5e6f7a8b9c0d1";

      //when
      const result = validateId(id);

      //then
      expect(result).toBeNull();
    });

    it("should return error when the id is empty", () => {
      //given
      const id = "";

      //when
      const result = validateId(id);

      //then
      expect(result).toContainEqual({
        field: "id",
        message: "A valid book id is required",
      });
    });

    it("should return error when the id is not a valid ObjectId format", () => {
      //given
      const id = "not-a-valid-id";

      //when
      const result = validateId(id);

      //then
      expect(result).toContainEqual({
        field: "id",
        message: "A valid book id is required",
      });
    });

  });

    describe("validateBook", () => {

    it("should return null when all inputs are valid", () => {
      //given
      const title = "Clean Code";
      const author = "Robert C. Martin";
      const pages = 464;
      const rating = 4;

      //when
      const result = validateBook(title, author, pages, rating);

      //then
      expect(result).toBeNull();
    });

    it("should return error when title is too short", () => {
      //given
      const result = validateBook("C", "Robert C. Martin", 464, 4);

      //then
      expect(result).toContainEqual({
        field: "title",
        message: "Title must be at least 2 characters",
      });
    });

    it("should return error when author is too short", () => {
      //given
      const result = validateBook("Clean Code", "R", 464, 4);

      //then
      expect(result).toContainEqual({
        field: "author",
        message: "Author must be at least 2 characters",
      });
    });

    it("should return error when pages is 0 or less", () => {
      //given
      const result = validateBook("Clean Code", "Robert C. Martin", 0, 4);

      //then
      expect(result).toContainEqual({
        field: "pages",
        message: "Pages must be greater than 0",
      });
    });

    it("should return error when rating is out of range", () => {
      //given
      const result = validateBook("Clean Code", "Robert C. Martin", 464, 6);

      //then
      expect(result).toContainEqual({
        field: "rating",
        message: "Rating must be between 0 and 5",
      });
    });

    it("should not require rating", () => {
      //given
      const result = validateBook(
        "Clean Code",
        "Robert C. Martin",
        464,
        undefined as unknown as number,
      );

      //then
      expect(result).toBeNull();
    });

  });

});