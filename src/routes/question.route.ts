import express from "express";
import * as QuestionController from "../controllers/question.controller";
import { requiresAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.get('/:id', requiresAuth, QuestionController.getQuestions);
router.post('/answer', requiresAuth, QuestionController.answerQuestion);

export default router;
