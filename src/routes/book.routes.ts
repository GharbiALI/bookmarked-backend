import { Router } from "express";
import { listBooksHandler, getBookHandler } from "../controllers/book.controller";
import { authenticate } from "../auth/auth.middleware";
import { validateIdMiddleware } from "../middlewares/book.middleware";

const router = Router();

router.use(authenticate);

router.get("/", listBooksHandler);
router.get("/:id", validateIdMiddleware, getBookHandler);

export default router;