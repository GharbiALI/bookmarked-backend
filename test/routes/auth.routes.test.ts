import request from "supertest";
import dotenv from "dotenv";
import app from "../../src/app";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../db.config";

dotenv.config();
jest.setTimeout(30000);

describe("Signup routes integration", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  const validSignupPayload = {
    username: "ali",
    email: "ali@example.com",
    password: "Password123!",
  };

  describe("POST /api/auth/signup", () => {
    it("should return 201 with user and token on successful signup", async () => {
      //given (validSignupPayload)

      // When
      const res = await request(app)
        .post("/api/auth/signup")
        .send(validSignupPayload);

      // Then
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data.user).toMatchObject({
        username: "ali",
        email: "ali@example.com",
      });
    });

    it("should not expose the password in the response", async () => {
      //given (validSignupPayload)

      // When
      const res = await request(app)
        .post("/api/auth/signup")
        .send(validSignupPayload);

      // Then
      expect(res.status).toBe(201);
      expect(res.body.data.user).not.toHaveProperty("password");
    });

    it("should return 409 when the email is already registered", async () => {
      //given
      const secondPayload = { ...validSignupPayload, username: "ali2" };

      // When
      await request(app).post("/api/auth/signup").send(validSignupPayload);

      const secondResponse = await request(app)
        .post("/api/auth/signup")
        .send(secondPayload);

      // Then
      expect(secondResponse.status).toBe(409);
      expect(secondResponse.body).toHaveProperty(
        "message",
        "A user with this email already exists",
      );
    });


    it("should return 400 when signup data is invalid", async () => {
      //given
      const invalidPayload = {
        username: "al",
        email: "invalidEmail",
        password: "az",
      };

      // When
      const res = await request(app)
        .post("/api/auth/signup")
        .send(invalidPayload);

      // Then
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toContainEqual({
        field: "username",
        message: "Username must be at least 3 characters",
      });
      expect(res.body.errors).toContainEqual({
        field: "email",
        message: "A valid email is required",
      });
      expect(res.body.errors).toContainEqual({
        field: "password",
        message:
          "Password must be at least 12 characters and include uppercase, lowercase, number and symbol",
      });
    });
  });
});