import { RequestHandler } from "express";
import { User } from "../entities/user.entity";
import { MedicineBoughtTime, MedicineSource, PillCount } from "../entities/pill_count.entity";

export const postPillCount: RequestHandler = async (req, res, next) => {
    try {
        const { medicine_used, medicine_before, medicine_after, medicine_bought_date } = req.body;
        const medicine_source = req.body.medicine_source as MedicineSource;
        const medicine_bought_time = req.body.medicine_bought_time as MedicineBoughtTime;

        const user = await User.findOneOrFail({ where: { id: req.user_id }, relations: { pill_counts: true } });

        const pillCount = PillCount.create({
            medicine_used: medicine_used,
            medicine_after: medicine_after,
            medicine_bought_date: new Date(parseInt(medicine_bought_date)),
            medicine_bought_time: medicine_bought_time,
            medicine_source: medicine_source,
            medicine_before: medicine_before
        });
        pillCount.user = user;
        await pillCount.save();

        req.body = pillCount;
        next();
    } catch (err) {
        next(err);
    }
}

export const updatePillCount: RequestHandler = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const pillCountNumber = Number(req.params.number);

        const { medicine_used, medicine_before, medicine_after, medicine_bought_timestamp } = req.body;
        const medicine_source = req.body.medicine_source as MedicineSource;
        const medicine_bought_time = req.body.medicine_bought_time as MedicineBoughtTime;

        const pillCount = await PillCount.findOneOrFail({ where: { user: { id: userId }, number: pillCountNumber } });

        pillCount.medicine_used = medicine_used;
        pillCount.medicine_after = medicine_after;
        pillCount.medicine_bought_date = new Date(parseInt(medicine_bought_timestamp));
        pillCount.medicine_bought_time = medicine_bought_time;
        pillCount.medicine_source = medicine_source;
        pillCount.medicine_before = medicine_before;
        const today = new Date();
        pillCount.done_date = today;

        await pillCount.save();

        if (pillCountNumber < 3) {
            const nextPillCount = await PillCount.findOneOrFail({ where: { user: { id: userId }, number: pillCountNumber + 1 } });
            const nextTwoWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7 * 2);
            nextPillCount.locked_until_date = nextTwoWeek;
            await nextPillCount.save();
        }

        req.body = pillCount;
        next();
    } catch (err) {
        next(err);
    }
}

export const getPillCounts: RequestHandler = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const pillCounts = await PillCount.find({ where: { user: { id: userId } } });
        req.body = pillCounts;
        next();
    } catch (err) {
        next(err);
    }
}