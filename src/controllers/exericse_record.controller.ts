import { RequestHandler } from "express";
import { ExerciseRecord } from "../entities/exercise_record.entity";
import { User } from "../entities/user.entity";
import { Session } from "../entities/session.entity";
import { ExerciseLevel } from "../entities/exercise.entity";

export const getExerciseRecords: RequestHandler = async (req, res, next) => {
    try {
        const level = req.params.level as ExerciseLevel;
        const records = await ExerciseRecord.find({ where: { user: { id: req.user_id }, session: { level: level } }, relations: { session: true } });
        req.body = records.map(val => <unknown>{ week: val.session.week, day: val.session.day });
        next();
    } catch (err) {
        next(err);
    }
}

export const postExerciseRecord: RequestHandler = async (req, res, next) => {
    try {
        const week = Number(req.params.week);
        const day = Number(req.params.day);
        const level = req.params.level as ExerciseLevel;

        const user = await User.findOneOrFail({ where: { id: req.user_id } });
        const session = await Session.findOneOrFail({ where: { day: day, week: week, level: level } });
        const record = ExerciseRecord.create({
            user: user,
            session: session
        });
        await record.save();
        req.body = record;

        next();
    } catch (err) {
        next(err);
    }
}