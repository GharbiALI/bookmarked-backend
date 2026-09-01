import { Router } from "express";
import { signup } from "../controllers/auth.controller";
import { validateSignupMiddleware } from "../middlewares/user.middleware";

const router = Router();

router.post("/signup", validateSignupMiddleware, signup);

export default router;
