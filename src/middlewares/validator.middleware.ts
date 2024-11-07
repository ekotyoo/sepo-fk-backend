import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import createHttpError from "http-errors";

export default (req: Request, res: Response, next: NextFunction, schema: Joi.ObjectSchema<unknown>) => {
    const { error } = schema.validate(req.body);

    if (error) {
        next(createHttpError(400, error.details[0].message.replace("/[^a-zA-Z0-9 ]/g", "")));
        return;
    }

    next();
}