import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";
import {
  validateSignupMiddleware,
  validateLoginMiddleware,
} from "../middlewares/user.middleware";

const router = Router();

router.post("/signup", validateSignupMiddleware, signup);
router.post("/login", validateLoginMiddleware, login);

export default router;
