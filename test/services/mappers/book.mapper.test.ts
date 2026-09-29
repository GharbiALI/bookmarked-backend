import { Types } from "mongoose";
import { Book } from "../../../src/schemas/book.schemas";
import { mapBookEntity } from "../../../src/services/mappers/book.mapper";

describe("service mapper: mapBookEntity", () => {
  it("should map an entity to a domain object with string ids", () => {
    //given
    const entity = new Book({
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-help",
      pages: 320,
      status: "reading",
      rating: 4,
      userId: new Types.ObjectId(),
    });

    //when
    const result = mapBookEntity(entity);

    //then
    expect(result).toEqual({
      id: entity._id.toString(),
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-help",
      pages: 320,
      status: "reading",
      rating: 4,
      userId: entity.userId.toString(),
    });
    expect(typeof result.id).toBe("string");
    expect(typeof result.userId).toBe("string");
  });

  it("should default genre to an empty string when missing", () => {
    //given
    const entity = new Book({
      title: "Untitled Notes",
      author: "Unknown",
      pages: 50,
      userId: new Types.ObjectId(),
    });
    entity.genre = undefined;

    //when
    const result = mapBookEntity(entity);

    //then
    expect(result.genre).toBe("");
  });

  it("should return a plain object, not a Mongoose document", () => {
    //given
    const entity = new Book({
      title: "Deep Work",
      author: "Cal Newport",
      pages: 296,
      userId: new Types.ObjectId(),
    });

    //when
    const result = mapBookEntity(entity);

    //then
    expect(result).not.toBeInstanceOf(Book);
    expect(result).not.toHaveProperty("_id");
    expect(result).not.toHaveProperty("save");
  });
});
