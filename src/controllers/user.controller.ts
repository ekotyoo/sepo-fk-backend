import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { Test } from "../entities/test.entity";
import { User } from "../entities/user.entity";
import { Answer } from "../entities/answer.entity";

export const getUser: RequestHandler = async (req, res, next) => {
    const id = Number(req.params.id);

    try {
        const user = await User.findOneBy({ id: id });

        if (!user) {
            next(createHttpError(404, `User with id ${id} does not exists`));
            return;
        }

        req.body = user;
        next();
    } catch (err) {
        next(err);
    }
}

export const getUserTestScore: RequestHandler = async (req, res, next) => {
    const id = Number(req.params.id);
    const testId = Number(req.params.test_id);

    try {
        const test = await Test.findOneOrFail({ where: { id: testId }, relations: { surveys: { questions: { options: true } } } });
        const surveys = test.surveys;

        const answers = await Answer.find({ where: { userId: id } });
        const score: { kebutuhan_natrium: number | null, vas: number | null, womac: number | null } = {
            kebutuhan_natrium: null,
            vas: null,
            womac: null
        };
        surveys.forEach((survey) => {
            if (survey.name == 'Kebutuhan Natrium') {
                let total = 0;
                survey.questions.forEach((question) => {
                    const currentAnswer = answers.find((answer) => answer.questionId === question.id);
                    if (!currentAnswer) return;
                    if (currentAnswer.optionId === question.correct_option) total++;
                });
                score.kebutuhan_natrium = total;
            } else if (survey.name == 'VAS') {
                let total = 0;
                survey.questions.forEach((question) => {
                    const currentAnswer = answers.find((answer) => answer.questionId === question.id);
                    if (!currentAnswer) return;
                    const option = question.options.find((option) => option.id === currentAnswer.optionId);
                    total += option?.number ?? 0;
                });
                score.vas = total;
            } else if (survey.name == 'WOMAC') {
                let total = 0;
                survey.questions.forEach((question) => {
                    const currentAnswer = answers.find((answer) => answer.questionId === question.id);
                    if (!currentAnswer) return;
                    const option = question.options.find((option) => option.id === currentAnswer.optionId);
                    total += option?.number ?? 0;
                });
                score.womac = total;
            }
        });

        req.body = score;
        next();
    } catch (err) {
        next(err);
    }
}

export const updateUser: RequestHandler = async (req, res, next) => {
    const id = Number(req.params.id);
    const { name, delete_old, device_token } = req.body;
    const avatar = req.file as Express.Multer.File;

    try {
        const user = await User.findOneBy({ id: id });

        if (!user) {
            next(createHttpError(404, `User with id ${id} does not exists`));
            return;
        }

        if (name) user.name = name;
        if (device_token) user.device_token = device_token;
        if (avatar) {
            const newPath = avatar.path.replace(/\\/g, '/');
            user.avatar_path = newPath;
        }
        if (delete_old == true || delete_old == "true") {
            user.avatar_path = null;
        }

        const updatedUser = await user.save();
        req.body = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            is_admin: updatedUser.is_admin,
            avatar: updatedUser.avatar_path,
        };
        next();
    } catch (err) {
        next(err);
    }
}