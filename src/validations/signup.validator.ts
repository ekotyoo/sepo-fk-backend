import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import validationHandler from "../middlewares/validator.middleware";

export const signUpValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(64).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
        confirm_password: Joi.any().valid(Joi.ref("password")).required().messages({
            "any.only": "Password must watch"
        })
    });

    validationHandler(req, res, next, schema);
};