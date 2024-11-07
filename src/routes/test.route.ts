import express from "express";
import * as TestController from "../controllers/test.controller";
import { requiresAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.get('/', requiresAuth, TestController.getTests);

export default router;
