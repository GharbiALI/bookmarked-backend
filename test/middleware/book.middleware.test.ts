import { Request, Response, NextFunction } from "express";
import { validateIdMiddleware } from "../../src/middlewares/book.middleware";

const mockRequest = (params: Record<string, string>): Partial<Request> => ({ params });

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

describe("book.middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateIdMiddleware", () => {

    it("should call next() when the id is valid", () => {
      //given
      const req = mockRequest({ id: "64f1a2b3c4d5e6f7a8b9c0d1" });
      const res = mockResponse();

      //when
      validateIdMiddleware(req as Request, res as Response, mockNext);

      //then
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should respond with 400 when the id is not a valid ObjectId", () => {
      //given
      const req = mockRequest({ id: "not-a-valid-id" });
      const res = mockResponse();

      //when
      validateIdMiddleware(req as Request, res as Response, mockNext);

      //then
      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

  });
});