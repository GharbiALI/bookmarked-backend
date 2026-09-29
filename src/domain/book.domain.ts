export type ReadStatus = "reading" | "to-read" | "finished";

export interface BookDomain {
  id: string;
  title: string;
  author: string;
  genre: string;
  pages: number;
  status: ReadStatus;
  rating: number;
  userId: string;
}
