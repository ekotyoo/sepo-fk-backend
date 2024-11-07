import express from "express"
import { requiresAuth } from "../middlewares/auth.middleware";
import * as ArticleController from "../controllers/article.controller";
import * as ArticleRecordController from "../controllers/article_record.controller";

const router = express.Router();

router.get("/", requiresAuth, ArticleController.getArticles);
router.get("/:id", requiresAuth, ArticleController.getArticle);
router.post("/:id/record", requiresAuth, ArticleRecordController.postArticleRecord);

export default router;