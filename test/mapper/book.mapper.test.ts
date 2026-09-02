import { mapBookResponse } from "../../src/mapper/book.mapper";
import { IBook } from "../../src/schemas/book.schemas";
import { Types } from "mongoose";

describe("mapBookResponse", () => {

  it("should map a book document to a response with required fields", () => {
    //given
    const mockBook: IBook & { _id: Types.ObjectId } = {
      _id: new Types.ObjectId(),
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-help",
      pages: 320,
      status: "to-read",
      rating: 0,
      userId: new Types.ObjectId(),
    };

    //when
    const result = mapBookResponse(mockBook);

    //then
    expect(result.id).toBe(String(mockBook._id));
    expect(result.title).toBe(mockBook.title);
    expect(result.author).toBe(mockBook.author);
    expect(result.genre).toBe(mockBook.genre);
    expect(result.pages).toBe(mockBook.pages);
    expect(result.status).toBe(mockBook.status);
    expect(result.rating).toBe(mockBook.rating);
  });

  it("should default genre to an empty string when missing", () => {
    //given
    const mockBook: IBook & { _id: Types.ObjectId } = {
      _id: new Types.ObjectId(),
      title: "Untitled Notes",
      author: "Unknown",
      pages: 50,
      status: "reading",
      rating: 2,
      userId: new Types.ObjectId(),
    };

    //when
    const result = mapBookResponse(mockBook);

    //then
    expect(result.genre).toBe("");
  });

  it("should not include userId in the mapped response", () => {
    //given
    const mockBook: IBook & { _id: Types.ObjectId } = {
      _id: new Types.ObjectId(),
      title: "Deep Work",
      author: "Cal Newport",
      genre: "Productivity",
      pages: 296,
      status: "finished",
      rating: 5,
      userId: new Types.ObjectId(),
    };

    //when
    const result = mapBookResponse(mockBook);

    //then
    expect(result).not.toHaveProperty("userId");
  });

});