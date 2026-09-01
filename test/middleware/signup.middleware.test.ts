import { Request, Response, NextFunction } from "express";
import { validateSignupMiddleware } from "../../src/middlewares/signup.middleware";

const mockRequest = (body: object): Partial<Request> => ({ body });

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

describe("signup.middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateSignupMiddleware", () => {
    it("should call next() when all inputs are valid", () => {
      //given
      const req = mockRequest({
        username: "ali",
        email: "ali@example.com",
        password: "Password123!",
      });
      const res = mockResponse();

      //when
      validateSignupMiddleware(req as Request, res as Response, mockNext);

      //then
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should respond with 400 when username is too short", () => {
      //given
      const req = mockRequest({
        username: "al",
        email: "alice@example.com",
        password: "Password123!",
      });
      const res = mockResponse();

      //when
      validateSignupMiddleware(req as Request, res as Response, mockNext);

      //then
      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should respond with 400 when email is invalid", () => {
      //given
      const req = mockRequest({
        username: "alice",
        email: "invalid",
        password: "Password123!",
      });
      const res = mockResponse();

      //when
      validateSignupMiddleware(req as Request, res as Response, mockNext);

      //then
      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should respond with 400 when password is not strong enough", () => {
      //given
      const req = mockRequest({
        username: "alice",
        email: "alice@example.com",
        password: "weak",
      });
      const res = mockResponse();

      //when
      validateSignupMiddleware(req as Request, res as Response, mockNext);

      //then
      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should respond with 400 when body is empty", () => {
      //given
      const req = mockRequest({});
      const res = mockResponse();

      //when
      validateSignupMiddleware(req as Request, res as Response, mockNext);

      //then
      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});