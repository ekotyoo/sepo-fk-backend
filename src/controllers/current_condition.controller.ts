import { RequestHandler } from "express";
import { User } from "../entities/user.entity";
import { CurrentCondition, ExerciseDuration, IllnessDuration } from "../entities/current_condition.entity";

export const postCurrentCondition: RequestHandler = async (req, res, next) => {
    try {
        const { illness_history, joint_trauma_cause } = req.body;
        const illness_duration = req.body.illness_duration as IllnessDuration;
        const exercise_duration = req.body.exercise_duration as ExerciseDuration;

        const user = await User.findOneOrFail({ where: { id: req.user_id }, relations: { current_condition: true } });
        if (user.current_condition) {
            return next();
        }

        const currentCondition = CurrentCondition.create({
            illness_history: illness_history,
            illness_duration: illness_duration,
            exercise_duration: exercise_duration,
            joint_trauma_cause: joint_trauma_cause
        });
        await currentCondition.save();
        user.current_condition = currentCondition;
        await user.save();

        req.body = currentCondition;
        next();
    } catch (err) {
        next(err);
    }
}