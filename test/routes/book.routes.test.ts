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

  describe("GET /api/books/:id", () => {
    it("should return 401 when no token is provided", async () => {
      // When
      const res = await request(app).get("/api/books/64f1a2b3c4d5e6f7a8b9c0d1");

      // Then
      expect(res.status).toBe(401);
    });

    it("should return 400 when the id is not a valid ObjectId", async () => {
      //given
      const token = await getAuthToken();

      // When
      const res = await request(app)
        .get("/api/books/not-a-valid-id")
        .set("Authorization", `Bearer ${token}`);

      // Then
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 404 when the book does not exist", async () => {
      //given
      const token = await getAuthToken();

      // When
      const res = await request(app)
        .get("/api/books/64f1a2b3c4d5e6f7a8b9c0d1")
        .set("Authorization", `Bearer ${token}`);

      // Then
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Book not found");
    });

    it("should return 404 when the book belongs to another user", async () => {
      //given
      const token = await getAuthToken();

      const otherUsersBook = await Book.create({
        title: "Someone Else's Book",
        author: "A. Stranger",
        pages: 100,
        status: "reading",
        rating: 3,
        userId: "64f1a2b3c4d5e6f7a8b9c0d1",
      });

      // When
      const res = await request(app)
        .get(`/api/books/${otherUsersBook._id}`)
        .set("Authorization", `Bearer ${token}`);

      // Then
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Book not found");
    });

    it("should return 200 with the book when it belongs to the logged-in user", async () => {
      //given
      const token = await getAuthToken();
      const decoded: { userId: string } = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );

      const myBook = await Book.create({
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self-help",
        pages: 320,
        status: "to-read",
        rating: 0,
        userId: decoded.userId,
      });

      // When
      const res = await request(app)
        .get(`/api/books/${myBook._id}`)
        .set("Authorization", `Bearer ${token}`);

      // Then
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(String(myBook._id));
      expect(res.body.data.title).toBe("Atomic Habits");
    });
  });

  describe("POST /api/books", () => {
    it("should return 401 when no token is provided", async () => {
      // When
      const res = await request(app).post("/api/books").send({
        title: "Clean Code",
        author: "Robert C. Martin",
        pages: 464,
      });

      // Then
      expect(res.status).toBe(401);
    });

    it("should return 400 when required fields are missing", async () => {
      //given
      const token = await getAuthToken();

      // When
      const res = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "C" });

      // Then
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 201 and create the book for the logged-in user", async () => {
      //given
      const token = await getAuthToken();

      // When
      const res = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Clean Code",
          author: "Robert C. Martin",
          genre: "Software Engineering",
          pages: 464,
          status: "to-read",
          rating: 4,
        });

      // Then
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Clean Code");
      expect(res.body.data).not.toHaveProperty("userId");
    });

    it("should default status to to-read when not provided", async () => {
      //given
      const token = await getAuthToken();

      // When
      const res = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Refactoring",
          author: "Martin Fowler",
          pages: 448,
        });

      // Then
      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe("to-read");
    });
  });

  describe("PUT /api/books/:id", () => {
    it("should return 401 when no token is provided", async () => {
      // When
      const res = await request(app)
        .put("/api/books/64f1a2b3c4d5e6f7a8b9c0d1")
        .send({ title: "Updated Title", author: "Someone", pages: 100 });

      // Then
      expect(res.status).toBe(401);
    });

    it("should return 400 when the id is not a valid ObjectId", async () => {
      //given
      const token = await getAuthToken();

      // When
      const res = await request(app)
        .put("/api/books/not-a-valid-id")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Title", author: "Someone", pages: 100 });

      // Then
      expect(res.status).toBe(400);
    });

    it("should return 400 when the update data is invalid", async () => {
      //given
      const token = await getAuthToken();
      const decoded: { userId: string } = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );

      const myBook = await Book.create({
        title: "Clean Code",
        author: "Robert C. Martin",
        pages: 464,
        status: "to-read",
        rating: 0,
        userId: decoded.userId,
      });

      // When
      const res = await request(app)
        .put(`/api/books/${myBook._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "C", author: "Robert C. Martin", pages: 464 });

      // Then
      expect(res.status).toBe(400);
    });

    it("should return 404 when the book does not exist", async () => {
      //given
      const token = await getAuthToken();

      // When
      const res = await request(app)
        .put("/api/books/64f1a2b3c4d5e6f7a8b9c0d1")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Title", author: "Someone", pages: 100 });

      // Then
      expect(res.status).toBe(404);
    });

    it("should return 404 when the book belongs to another user", async () => {
      //given
      const token = await getAuthToken();

      const otherUsersBook = await Book.create({
        title: "Design Patterns",
        author: "Erich Gamma",
        pages: 395,
        status: "reading",
        rating: 4,
        userId: "64f1a2b3c4d5e6f7a8b9c0d1",
      });

      // When
      const res = await request(app)
        .put(`/api/books/${otherUsersBook._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Hacked Title", author: "Erich Gamma", pages: 395 });

      // Then
      expect(res.status).toBe(404);
    });

    it("should return 200 and the updated book when it belongs to the logged-in user", async () => {
      //given
      const token = await getAuthToken();
      const decoded: { userId: string } = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );

      const myBook = await Book.create({
        title: "Clean Code",
        author: "Robert C. Martin",
        pages: 464,
        status: "to-read",
        rating: 0,
        userId: decoded.userId,
      });

      // When
      const res = await request(app)
        .put(`/api/books/${myBook._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Clean Code",
          author: "Robert C. Martin",
          pages: 464,
          status: "finished",
          rating: 5,
        });

      // Then
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("finished");
      expect(res.body.data.rating).toBe(5);
    });
  });

  describe("DELETE /api/books/:id", () => {
    it("should return 401 when no token is provided", async () => {
      // When
      const res = await request(app).delete(
        "/api/books/64f1a2b3c4d5e6f7a8b9c0d1",
      );

      // Then
      expect(res.status).toBe(401);
    });

    it("should return 400 when the id is not a valid ObjectId", async () => {
      //given
      const token = await getAuthToken();

      // When
      const res = await request(app)
        .delete("/api/books/not-a-valid-id")
        .set("Authorization", `Bearer ${token}`);

      // Then
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 404 when the book does not exist", async () => {
      //given
      const token = await getAuthToken();

      // When
      const res = await request(app)
        .delete("/api/books/64f1a2b3c4d5e6f7a8b9c0d1")
        .set("Authorization", `Bearer ${token}`);

      // Then
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Book not found");
    });

    it("should return 404 when the book belongs to another user", async () => {
      //given
      const token = await getAuthToken();

      const otherUsersBook = await Book.create({
        title: "Someone Else's Book",
        author: "A. Stranger",
        pages: 100,
        status: "reading",
        rating: 3,
        userId: "64f1a2b3c4d5e6f7a8b9c0d1",
      });

      // When
      const res = await request(app)
        .delete(`/api/books/${otherUsersBook._id}`)
        .set("Authorization", `Bearer ${token}`);

      // Then
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Book not found");

      const stillExists = await Book.findById(otherUsersBook._id);
      expect(stillExists).not.toBeNull();
    });

    it("should return 200 and delete the book when it belongs to the logged-in user", async () => {
      //given
      const token = await getAuthToken();
      const decoded: { userId: string } = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );

      const myBook = await Book.create({
        title: "Clean Code",
        author: "Robert C. Martin",
        pages: 464,
        status: "to-read",
        rating: 0,
        userId: decoded.userId,
      });

      // When
      const res = await request(app)
        .delete(`/api/books/${myBook._id}`)
        .set("Authorization", `Bearer ${token}`);

      // Then
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(String(myBook._id));

      const deleted = await Book.findById(myBook._id);
      expect(deleted).toBeNull();
    });
  });
});
