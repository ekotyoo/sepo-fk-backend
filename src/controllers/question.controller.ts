import { RequestHandler } from "express";
import { Survey } from "../entities/survey.entity";
import { Answer } from "../entities/answer.entity";
import { UserToTest } from "../entities/test.entity";
import { Option } from "../entities/option.entity";
import { In } from "typeorm";
import { Question } from "../entities/question.entity";
import createHttpError from "http-errors";
import { ScoreRecord } from "../entities/score_record.entity";
import { User } from "../entities/user.entity";

export const getQuestions: RequestHandler = async (req, res, next) => {
    try {
        const survey_id = Number(req.params.id);
        const survey = await Survey.findOneOrFail({ where: { id: survey_id }, relations: { questions: { options: true } } });
        const questions = survey.questions;

        req.body = questions;
        next();
    } catch (err) {
        next(err);
    }
}

export const answerQuestion: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.user_id;
        const userAnswers = req.body.answers;
        const testId = req.body.test_id;
        const surveyId = req.body.survey_id;

        const testScore = await UserToTest.findOneOrFail({ where: { user: { id: userId }, test: { id: testId } } });

        if (surveyId) {
            const survey = await Survey.findOne({ where: { id: surveyId } });
            if (survey) {
                if (survey.name == 'Kebutuhan Natrium') {
                    let score = 0;
                    for (let i = 0; i < userAnswers.length; i++) {
                        const answer = userAnswers[i];
                        const question = await Question.findOne({ where: { id: answer.question_id } });
                        if (question?.correct_option == answer.option_id) {
                            score++;
                        }
                    }
                    testScore.kebutuhan_natrium = score;
                    await testScore.save();
                } else if (survey.name == 'WOMAC') {
                    if (userAnswers.length > 0) {
                        let score = 0;
                        for (let i = 0; i < userAnswers.length; i++) {
                            const answer = userAnswers[i];
                            const option = await Option.findOne({ where: { id: answer.option_id } });
                            score += option?.number ?? 0;
                        }
                        testScore.womac = score;
                        await testScore.save();
                    }
                } else if (survey.name == 'VAS') {
                    if (userAnswers.length > 0) {
                        const optionId = userAnswers[0].option_id;
                        const option = await Option.findOneOrFail({ where: { id: optionId } });
                        const score = option.number;
                        testScore.vas = score;
                        await testScore.save();
                    }
                }
            } else {
                next(createHttpError(400, "Failed to answer survey"));
            }
        } else {
            next(createHttpError(400, "Failed to answer survey"));
        }

        await userAnswers.forEach(async (val) => {
            const answer = Answer.create({
                optionId: val.option_id,
                questionId: val.question_id,
                userId: userId,
            });
            await answer.save();
        });

        if (testScore != null) {
            const totalSurvey = (await Survey.find()).length;
            testScore.survey_done_count = testScore.survey_done_count + 1;
            if (testScore.survey_done_count == totalSurvey) {
                testScore.done_date = new Date();
                const user = await User.findOneOrFail({ where: { id: userId } })
                const scoreRecord = ScoreRecord.create({ user: user, score: 10 });
                await scoreRecord.save();
            }

            await testScore.save();
        }

        next();
    } catch (err) {
        next(err);
    }
}