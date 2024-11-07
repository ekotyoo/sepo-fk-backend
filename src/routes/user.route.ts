import express from "express"
import * as UserController from "../controllers/user.controller"
import * as PersonalDataController from "../controllers/personal_data.controller";
import * as CurrentConditionController from "../controllers/current_condition.controller";
import * as PillCountController from "../controllers/pill_count.controller";
import * as ArticleRecordController from "../controllers/article_record.controller";

import { requiresAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/upload.config";

const router = express.Router();

router.get("/:id", requiresAuth, UserController.getUser);
router.put("/:id", requiresAuth, upload.single("avatar"), UserController.updateUser);
router.get("/:id/personaldata", requiresAuth, PersonalDataController.getPersonalData);
router.post("/personaldata", requiresAuth, PersonalDataController.postPersonalData);
router.post("/currentcondition", requiresAuth, CurrentConditionController.postCurrentCondition);
router.get("/:id/pillcount", PillCountController.getPillCounts);
router.post("/pillcount", requiresAuth, PillCountController.postPillCount);
router.put("/:id/pillcount/:number", requiresAuth, PillCountController.updatePillCount);
router.get("/:id/articlerecord", requiresAuth, ArticleRecordController.getArticleRecords);
router.get("/:id/articleprogress", requiresAuth, ArticleRecordController.getArticleProgress);
router.get("/:id/testscore/:test_id", requiresAuth, UserController.getUserTestScore);

export default router;