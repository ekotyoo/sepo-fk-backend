import { RequestHandler } from "express";
import { Notification } from "../entities/notification.entity";

export const getNotifications: RequestHandler = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ where: { user: { id: req.user_id } } });
        req.body = notifications;
        next();
    } catch (err) {
        next(err);
    }
}