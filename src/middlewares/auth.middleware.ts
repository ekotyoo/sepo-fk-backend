import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Jwt, { TokenExpiredError, JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import env from "../util/env";

export const requiresAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const secret = env.JWT_SECRET_KEY;
        const token = req.headers.authorization?.split(" ")[1];

        if (token) {
            const decodedToken = Jwt.verify(token, secret);
            const payload = decodedToken as JwtPayload;

            req.user_id = payload.id;
            req.body = {
                ...req.body,
                user_id: payload.id
            };
            next();
        } else {
            next(createHttpError(400, "Token is empty"));
        }
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            next(createHttpError(401, "Token expired"));
        }

        if (err instanceof JsonWebTokenError) {
            next(createHttpError(401, "Token invalid"));
        }

        next(err);
    }
}










































