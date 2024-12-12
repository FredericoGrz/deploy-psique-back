import knex from "../database/knex";
import AppError from "../utils/AppError";
import { compare } from "bcryptjs";
import authConfig from "../configs/auth";
import { Secret, sign } from "jsonwebtoken";
import { Request, Response } from "express";

export class SessionController {
  async create(req: Request, res: Response) {
    try {
      let { email, password }: { email: string; password: "string" } = req.body;

      email = email.toLowerCase();

      const user = await knex("users").where({ email }).first();

      if (!user) {
        throw new AppError("Email ou senha inválidos", 401);
      }

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        throw new AppError("Email ou senha inválidos", 401);
      }

      const { secret, expiresIn } = authConfig.jwt;

      const token = sign({}, secret as Secret, {
        subject: String(user.id),
        expiresIn,
      });

      delete user.password;
      delete user.created_at;
      delete user.updated_at;

      res.status(200).json({ user, token });
    } catch (error) {
      throw new AppError("Falha ao realizar login", 500);
    }
  }
}
