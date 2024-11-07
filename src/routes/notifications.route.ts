import express from "express";
import { requiresAuth } from "../middlewares/auth.middleware";
import * as NotificationController from "../controllers/notification_controller";

const router = express.Router();

router.get('/', requiresAuth, NotificationController.getNotifications);

export default router;