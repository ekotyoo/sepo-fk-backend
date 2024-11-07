import express from "express";
import * as SurveyController from "../controllers/survey.controller";
import { requiresAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.get('/:id', requiresAuth, SurveyController.getSurveys);

export default router;
