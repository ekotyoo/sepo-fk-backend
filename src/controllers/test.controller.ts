import { RequestHandler } from "express";
import { UserToTest } from "../entities/test.entity";

export const getTests: RequestHandler = async (req, res, next) => {
    try {
        const user_id = Number(req.user_id);
        const userToTests = await UserToTest.find({ where: { user: { id: user_id } }, relations: { test: true } });

        const tests = userToTests.map(val => <unknown>{
            id: val.test.id,
            title: val.test.title,
            done_date: val.done_date,
            locked_until_date: val.locked_until_date
        });
        req.body = tests;
        next();
    } catch (err) {
        next(err);
    }
}