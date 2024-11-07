import { NextFunction, Request, Response } from "express";
import { isHttpError } from "http-errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.error(err);
    let errorMessage = "An unknown error occured";
    let statusCode = 500;

    if (isHttpError(err)) {
      statusCode = err.statusCode;
      errorMessage = err.message;
    }

    if (err instanceof Error) errorMessage = err.message;
    res.status(statusCode).json({
      status: "error",
      message: errorMessage
    });
    return;
  }

  return next();
};
