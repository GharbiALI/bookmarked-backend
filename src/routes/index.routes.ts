import { Router } from "express";
import signupRoutes from "./signup.routes";

const router = Router();

router.use("/auth", signupRoutes);

export default router;
