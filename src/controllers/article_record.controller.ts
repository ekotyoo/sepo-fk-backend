import { RequestHandler } from "express";
import { ArticleRecord } from "../entities/article_record.entity";
import { User } from "../entities/user.entity";
import { Article } from "../entities/article.entity";
import { ScoreRecord } from "../entities/score_record.entity";

export const postArticleRecord: RequestHandler = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const user = await User.findOneOrFail({ where: { id: req.user_id } });
        const article = await Article.findOneOrFail({ where: { id: id } });
        const oldRecord = await ArticleRecord.findOne({ where: { article: { id: id }, user: { id: req.user_id } } });

        if (oldRecord) return next();

        const articleRecord = ArticleRecord.create();
        articleRecord.user = user;
        articleRecord.article = article;
        await articleRecord.save();

        const scoreRecord = ScoreRecord.create({ user: user, score: article.point });
        await scoreRecord.save();

        next();
    } catch (err) {
        next(err);
    }
}

export const getArticleRecords: RequestHandler = async (req, res, next) => {
    try {
        const records = await ArticleRecord.find({ where: { user: { id: req.user_id } } });
        req.body = records;
        next();
    } catch (err) {
        next(err);
    }
}

export const getArticleProgress: RequestHandler = async (req, res, next) => {
    try {
        const articles = await Article.find();
        const records = await ArticleRecord.find({ where: { user: { id: req.user_id } } });

        const progress = records.length / articles.length;
        const nextArticle = articles[records.length];

        const scoreRecords = await ScoreRecord.find({ where: { user: { id: req.user_id } } });
        const score = scoreRecords.map((val) => val.score).reduce((sum, current) => sum + current, 0);

        req.body = {
            progress: progress,
            nextArticle: nextArticle,
            score: score
        }

        next();
    } catch (err) {
        next(err);
    }
}