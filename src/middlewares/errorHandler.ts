import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    res.status(error.status).json({ Status: "Error", message: error.message });
  } else {
    res.status(500).json({ Status: "Server Error", message: error.message });
  }
}
