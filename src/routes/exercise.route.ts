import express from "express";
import * as ExerciseController from "../controllers/exercise.controller";
import * as ExerciseRecordController from "../controllers/exericse_record.controller";
import { requiresAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.get('/:level/:week/:day', requiresAuth, ExerciseController.getExercises);
router.post('/:level/:week/:day', requiresAuth, ExerciseRecordController.postExerciseRecord);
router.get('/:level/records', requiresAuth, ExerciseRecordController.getExerciseRecords);

export default router;
