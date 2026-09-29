import {
  mapCreateBookRequest,
  mapUpdateBookRequest,
  mapBookResponse,
} from "../../../src/controllers/mappers/book.mapper";
import { BookDomain } from "../../../src/domain/book.domain";

describe("controller mapper: book", () => {
  describe("mapBookResponse", () => {
    const domain: BookDomain = {
      id: "64f1a2b3c4d5e6f7a8b9c0d1",
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-help",
      pages: 320,
      status: "to-read",
      rating: 0,
      userId: "64f1a2b3c4d5e6f7a8b9c0d2",
    };

    it("should map a domain object to the response DTO", () => {
      //when
      const result = mapBookResponse(domain);

      //then
      expect(result).toEqual({
        id: domain.id,
        title: domain.title,
        author: domain.author,
        genre: domain.genre,
        pages: domain.pages,
        status: domain.status,
        rating: domain.rating,
      });
    });

    it("should not expose userId to the client", () => {
      //when
      const result = mapBookResponse(domain);

      //then
      expect(result).not.toHaveProperty("userId");
    });
  });

  describe("mapCreateBookRequest / mapUpdateBookRequest", () => {
    const body = {
      title: "Clean Code",
      author: "Robert C. Martin",
      genre: "Software Engineering",
      pages: 464,
      status: "reading" as const,
      rating: 4,
      userId: "attacker-supplied-id",
      _id: "attacker-supplied-id",
    };

    it("should keep only the whitelisted fields when creating", () => {
      //when
      const result = mapCreateBookRequest(body);

      //then
      expect(result).toEqual({
        title: "Clean Code",
        author: "Robert C. Martin",
        genre: "Software Engineering",
        pages: 464,
        status: "reading",
        rating: 4,
      });
      expect(result).not.toHaveProperty("userId");
      expect(result).not.toHaveProperty("_id");
    });

    it("should keep only the whitelisted fields when updating", () => {
      //when
      const result = mapUpdateBookRequest(body);

      //then
      expect(result).not.toHaveProperty("userId");
      expect(result).not.toHaveProperty("_id");
      expect(result.title).toBe("Clean Code");
    });
  });
});
