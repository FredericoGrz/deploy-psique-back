import { verify, Secret } from "jsonwebtoken";
import AppError from "../utils/AppError";
import authConfig from "../configs/auth";
import { NextFunction, Request, Response } from "express";

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  // Ignorar autenticação no ambiente de teste
  if (process.env.NODE_ENV === "test") {
    req.user = { id: 1 }; // Opcional: definir um usuário fictício
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token not provided", 401);
  }

  const token = authHeader.replace("Bearer ", "");

  const jwtSecret: Secret = authConfig.jwt.secret as Secret;
  if (!jwtSecret) {
    throw new AppError("JWT secret is not defined", 500);
  }

  try {
    const decoded = verify(token, jwtSecret) as { sub: string };
    req.user = {
      id: Number(decoded.sub),
    };
    return next();
  } catch (error) {
    throw new AppError("Invalid token", 401);
  }
}



export default ensureAuthenticated;
