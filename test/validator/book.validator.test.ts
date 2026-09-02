import { validateId } from "../../src/validator/book.validator";

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
});