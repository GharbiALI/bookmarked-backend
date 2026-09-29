import { ReadStatus } from "../domain/book.domain";

export interface CreateBookDto {
  title: string;
  author: string;
  genre?: string;
  pages: number;
  status?: ReadStatus;
  rating?: number;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  genre?: string;
  pages?: number;
  status?: ReadStatus;
  rating?: number;
}
export interface BookResponseDto {
  id: string;
  title: string;
  author: string;
  genre: string;
  pages: number;
  status: ReadStatus;
  rating: number;
}
