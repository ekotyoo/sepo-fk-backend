import { RequestHandler } from "express";
import { Article } from "../entities/article.entity";

export const getArticles: RequestHandler = async (req, res, next) => {
    try {
        const articles = await Article.find({ select: { id: true, title: true, duration: true, point: true, week: true } });
        req.body = articles;
        next();
    } catch (err) {
        next(err);
    }
};

export const getArticle: RequestHandler = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const article = await Article.findOneByOrFail({ id: id });
        req.body = article;
        next();
    } catch (err) {
        next(err);
    }
}