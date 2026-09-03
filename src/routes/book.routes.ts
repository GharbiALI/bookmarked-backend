import { Router } from "express";
import { listBooksHandler, getBookHandler, createBookHandler} from "../controllers/book.controller";
import { authenticate } from "../auth/auth.middleware";
import { validateIdMiddleware, validateBookMiddleware } from "../middlewares/book.middleware";

const router = Router();

router.use(authenticate);

router.get("/", listBooksHandler);
router.get("/:id", validateIdMiddleware, getBookHandler);
router.post("/", validateBookMiddleware, createBookHandler);

export default router;