import { Response } from "express";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type TypedResponse<T> = Response<ApiResponse<T>>;
