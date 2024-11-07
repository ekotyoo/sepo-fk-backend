import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import validationHandler from "../middlewares/validator.middleware";

export const signInValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    });

    validationHandler(req, res, next, schema);
};