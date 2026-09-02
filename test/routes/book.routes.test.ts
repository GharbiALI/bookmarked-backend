import request from "supertest";
import dotenv from "dotenv";
import app from "../../src/app";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../db.config";
import { Book } from "../../src/schemas/book.schemas";

dotenv.config();
jest.setTimeout(30000);

describe("Book routes integration", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  const signupPayload = {
    username: "ali",
    email: "ali@example.com",
    password: "Password123!",
  };

  const getAuthToken = async (): Promise<string> => {
    const res = await request(app).post("/api/auth/signup").send(signupPayload);
    return res.body.data.token;
  };

  describe("GET /api/books", () => {

    it("should return 401 when no token is provided", async () => {
      // When
      const res = await request(app).get("/api/books");

      // Then
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 200 with an empty list when the user has no books", async () => {
      //given
      const token = await getAuthToken();

      // When
      const res = await request(app)
        .get("/api/books")
        .set("Authorization", `Bearer ${token}`);

      // Then
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it("should return only the books belonging to the logged-in user", async () => {
      //given
      const token = await getAuthToken();
      const decoded: { userId: string } = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );

      await Book.create({
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self-help",
        pages: 320,
        status: "to-read",
        rating: 0,
        userId: decoded.userId,
      });

      await Book.create({
        title: "Someone Else's Book",
        author: "A. Stranger",
        pages: 100,
        status: "reading",
        rating: 3,
        userId: "64f1a2b3c4d5e6f7a8b9c0d1",
      });

      // When
      const res = await request(app)
        .get("/api/books")
        .set("Authorization", `Bearer ${token}`);

      // Then
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe("Atomic Habits");
    });

    it("should not expose userId in the response", async () => {
      //given
      const token = await getAuthToken();
      const decoded: { userId: string } = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );

      await Book.create({
        title: "Deep Work",
        author: "Cal Newport",
        pages: 296,
        status: "finished",
        rating: 5,
        userId: decoded.userId,
      });

      // When
      const res = await request(app)
        .get("/api/books")
        .set("Authorization", `Bearer ${token}`);

      // Then
      expect(res.body.data[0]).not.toHaveProperty("userId");
    });

  });

});