import { RequestHandler } from "express";
import { Test, UserToTest } from "../entities/test.entity";

export const getSurveys: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.user_id;
        const testId = Number(req.params.id);
        const test = await Test.findOneOrFail({ where: { id: testId }, relations: { surveys: true } });

        const userToTests = await UserToTest.findOneOrFail({ where: { user: { id: userId }, test: { id: testId } } });
        const doneCount = userToTests.survey_done_count;

        const surveys = test.surveys.map((val, index) => {
            return {
                ...val,
                is_done: index < doneCount,
            };
        });

        req.body = surveys;
        next();
    } catch (err) {
        next(err);
    }
}