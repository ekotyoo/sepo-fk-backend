import { Request, Response } from "express";

export const responseFormatter = (req: Request, res: Response) => {
    const message = {
        status: "success",
        data: req.body
    };
    return res.status(req.statusCode || 200).json(message);
}