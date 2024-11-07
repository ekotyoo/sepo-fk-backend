import { RequestHandler } from "express";
import { Education, Gender, PersonalData } from "../entities/personal_data.entity";
import { User } from "../entities/user.entity";

export const getPersonalData: RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findOneOrFail({ where: { id: req.user_id }, relations: { personal_data: true } });
        const personal_data = user.personal_data;
        req.body = personal_data;
        next();
    } catch (err) {
        next(err);
    }
}

export const postPersonalData: RequestHandler = async (req, res, next) => {
    try {
        const { name, address, phone, birth_date_timestamp } = req.body;
        const gender = req.body.gender as Gender;
        const education = req.body.education as Education;

        const user = await User.findOneOrFail({ where: { id: req.user_id }, relations: { personal_data: true } });


        const personalData = PersonalData.create({
            name: name,
            address: address,
            gender: gender,
            education: education,
            phone: phone,
            birth_date: new Date(parseInt(birth_date_timestamp)),
        });
        await personalData.save();
        user.personal_data = personalData;
        await user.save();

        req.body = personalData;
        next();
    } catch (err) {
        next(err);
    }
}