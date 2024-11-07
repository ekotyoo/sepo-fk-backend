import express from "express"
import * as AuthController from "../controllers/auth.controller"
import { signInValidator } from "../validations/signin.validator";
import { signUpValidator } from "../validations/signup.validator";
import { requiresAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signup", signUpValidator, AuthController.signUp);

router.post("/signin", signInValidator, AuthController.signIn);

router.post("/signin/token", requiresAuth, AuthController.signInWithToken);

router.post("/signin/google", AuthController.signInWithGoogle);

router.post("/verify", AuthController.verifyUserEmail);

export default router;