import { Router } from "express";
import { listBooksHandler } from "../controllers/book.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", listBooksHandler);

export default router;