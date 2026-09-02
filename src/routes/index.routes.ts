import { Router } from "express";
import signupRoutes from "./auth.routes";
import bookRoutes from "./book.routes";

const router = Router();

router.use("/auth", signupRoutes);
router.use("/books", bookRoutes);

export default router;
