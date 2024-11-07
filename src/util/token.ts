import jwt from "jsonwebtoken";
import env from "./env"

export const encode = (id: number) => jwt.sign({ id }, env.JWT_SECRET_KEY, { expiresIn: '1d' });

export const decode = (token: string) => {
    try {
        return jwt.verify(token, env.JWT_SECRET_KEY);
    } catch (err) {
        console.error(err);
    }
};