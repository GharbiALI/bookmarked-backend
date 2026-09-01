import { Router } from "express";
import { signup } from "../controllers/signup.controller";
import { validateSignupMiddleware } from "../middlewares/signup.middleware";

const router = Router();

router.post("/signup", validateSignupMiddleware, signup);

export default router;
