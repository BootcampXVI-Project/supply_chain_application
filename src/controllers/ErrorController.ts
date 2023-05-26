import { Request, Response, NextFunction } from "express";
import { Error } from "../types/common";
import AppError from "../utils/appError";

const handleCastErrorDB = (err: Error) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: Error) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err.message,
      data: null
    });
  }

  // Send generic message
  console.error("ERROR 💥", err);
  return res.status(500).json({
    status: "error",
    error: "Something went very wrong!",
    data: null
  });
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  const isProduction = process.env.NODE_ENV === "production";

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (isProduction === false) {
    sendErrorDev(err, req, res, next);
  } else {
    let error = { ...err };

    // the error name and message are non-enumerable properties
    // meaning they are not included when using spread syntax to copy an object.
    error.message = err.message;
    error.name = err.name;

    // specify error message for each case if possible
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res, next);
  }
};
