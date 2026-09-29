import { Response, NextFunction } from "express";
import { authenticate, AuthRequest } from "../../src/auth/auth.middleware";
import { generateToken } from "../../src/auth/auth.services";
import { Types } from "mongoose";

const mockRequest = (headers: object): Partial<AuthRequest> => ({
  headers: headers as AuthRequest["headers"],
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

describe("auth.middleware", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticate", () => {

    it("should call next() and attach user when the token is valid", () => {
      //given
      const token = generateToken(new Types.ObjectId(), "ali");
      const req = mockRequest({ authorization: `Bearer ${token}` });
      const res = mockResponse();

      //when
      authenticate(req as AuthRequest, res as Response, mockNext);

      //then
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect((req as AuthRequest).user).toBeDefined();
      expect((req as AuthRequest).user?.username).toBe("ali");
    });

    it("should respond with 401 when no authorization header is provided", () => {
      //given
      const req = mockRequest({});
      const res = mockResponse();

      //when
      authenticate(req as AuthRequest, res as Response, mockNext);

      //then
      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should respond with 401 when the header doesn't start with Bearer", () => {
      //given
      const req = mockRequest({ authorization: "Token abc123" });
      const res = mockResponse();

      //when
      authenticate(req as AuthRequest, res as Response, mockNext);

      //then
      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should respond with 401 when the token is invalid", () => {
      //given
      const req = mockRequest({ authorization: "Bearer not-a-real-token" });
      const res = mockResponse();

      //when
      authenticate(req as AuthRequest, res as Response, mockNext);

      //then
      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

  });

});