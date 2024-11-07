import { RequestHandler } from "express";
import { Session } from "../entities/session.entity";
import { SessionToExercise } from "../entities/session_to_exercise.entity";
import { ExerciseLevel } from "../entities/exercise.entity";

export const getExercises: RequestHandler = async (req, res, next) => {
    try {
        const level = req.params.level as ExerciseLevel;
        const day = Number(req.params.day);
        const week = Number(req.params.week);
        const session = await Session.findOneOrFail(
            {
                where: { day: day, week: week, level: level },
            }
        );
        const sessionToExercise = await SessionToExercise.find({ where: { session: { id: session.id } }, relations: { exercise: true } });

        req.body = sessionToExercise.map((val) => <unknown>{ number: val.number, level: session.level, ...val.exercise });
        next();
    } catch (err) {
        next(err);
    }
}