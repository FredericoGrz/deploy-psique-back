const { hash, compare } = require("bcryptjs");
import { sign } from "jsonwebtoken";
import { Request, Response } from "express";
import knex from "../database/knex";
import AppError from "../utils/AppError";
import authConfig from "../configs/auth";

type userBodyProps = {
  name: string;
  email: string;
  password: string;
};

export default class UserController {
  async create(req: Request, res: Response) {
    try {
      let { name, email, password }: userBodyProps = req.body;
      const allRequiredDataAvailable = name && email && password;

      if (!allRequiredDataAvailable)
        throw new AppError("Por favor preencha todos os campos necessários!");

      email = email.toLowerCase();

      const userExists = await knex("users").where({ email }).first();

      if (userExists)
        throw new AppError("Já existe um usuário com este email!", 409);

      const hashedPassword = await hash(password, 10);

      await knex("users").insert({ name, email, password: hashedPassword });

      res.status(201).json({ message: "Created" });
    } catch (error) {
      const customError: Error = error as Error;
      console.log(customError);
      throw new AppError(customError.message);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      let {
        name,
        email,
        password,
      }: { name: string; email: string; password: string } = req.body;

      if (id != req.user?.id)
        throw new AppError(
          "Você não tem permissão para editar este usuário!",
          403
        );

      const userExists = await knex("users").where({ id }).first();

      if (!userExists) throw new AppError("Usuário não encontrado!", 404);

      if (email) {
        email = email.toLowerCase();
        const emailExists = await knex("users")
          .where({ email })
          .whereNot({ id })
          .first();

        if (emailExists)
          throw new AppError("Já existe um usuário com este email!", 409);
      }

      let updatedUser = { name, email, password };

      if (password) {
        const hashedPassword = await hash(password, 10);
        updatedUser = { ...updatedUser, password: hashedPassword };
      }

      await knex("users").where({ id }).update(updatedUser);

      res.status(200).json(updatedUser);
    } catch (error) {
      const customError: Error = error as Error;
      console.log(customError);
      throw new AppError(customError.message);
    }
  }

  // Novo método de autenticação
  async authenticate(req: Request, res: Response) {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      if (!email || !password) {
        throw new AppError("E-mail e senha são obrigatórios!", 400);
      }

      // Buscar usuário pelo e-mail
      const user = await knex("users").where({ email }).first();

      if (!user) {
        throw new AppError("E-mail ou senha incorretos.", 401);
      }

      // Comparar senha
      const passwordMatched = await compare(password, user.password);

      if (!passwordMatched) {
        throw new AppError("E-mail ou senha incorretos.", 401);
      }

      // Gerar token JWT
      const token = sign({}, authConfig.jwt.secret, {
        subject: String(user.id),
        expiresIn: authConfig.jwt.expiresIn,
      });

      // Retornar o usuário autenticado e o token
      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      const customError: Error = error as Error;
      console.log(customError);
      throw new AppError(customError.message);
    }
  }
}
