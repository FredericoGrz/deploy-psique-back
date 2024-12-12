import { Request, Response } from "express";
import knex from "../database/knex";
import AppError from "../utils/AppError";

type patientBodyProps = {
  name: string;
  date_of_birth: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  active?: boolean;
  deleted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  id?: number;
};

export default class PatientController {
  async index(req: Request, res: Response) {
    try {
      const patients = await knex("patients").where({ active: true });
      res.status(200).json(patients);
    } catch (error) {
      const customError: Error = error as Error;
      console.log(customError);
      throw new AppError(customError.message);
    }
  }

  async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const patient = await knex("patients")
        .where({ id, active: true })
        .first();

      if (!patient) throw new AppError("Paciente não encontrado!", 404);

      res.status(200).json(patient);
    } catch (error) {
      const customError: Error = error as Error;
      console.log(customError);
      throw new AppError(customError.message);
    }
  }

  async create(req: Request, res: Response) {
    try {
      let {
        name,
        date_of_birth,
        description,
        phone,
        whatsapp,
      }: patientBodyProps = req.body;

      const allRequiredDataAvailable = name && date_of_birth;

      if (!allRequiredDataAvailable)
        throw new AppError("Por favor preencha todos os campos necessários!");

      await knex("patients").insert({
        name,
        date_of_birth,
        description,
        phone,
        whatsapp,
      });

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
        date_of_birth,
        description,
        phone,
        whatsapp,
      }: patientBodyProps = req.body;
      const allRequiredDataAvailable = name && date_of_birth;

      if (!allRequiredDataAvailable)
        throw new AppError("Por favor preencha todos os campos necessários!");

      let patientExists = await knex("patients").where({ id }).first();

      if (!patientExists) throw new AppError("Paciente não encontrado!", 404);

      patientExists = { ...patientExists, name, description, phone, whatsapp };

      await knex("patients").where({ id }).update(patientExists);

      res.status(200).json(patientExists);
    } catch (error) {
      const customError: Error = error as Error;
      console.log(customError);
      throw new AppError(customError.message);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      let patientExists = await knex("patients").where({ id }).first();

      if (!patientExists) throw new AppError("Paciente não encontrado!", 404);

      patientExists = {
        ...patientExists,
        active: false,
        deleted_at: knex.fn.now(),
      };

      await knex("patients").where({ id }).update(patientExists);

      res.status(204).json({ message: "Deleted" });
    } catch (error) {
      const customError: Error = error as Error;
      console.log(customError);
      throw new AppError(customError.message);
    }
  }
  async addSession(req: Request, res: Response) {
    try {
      const { patient_id, attended, paymentMade, paymentAmount, notes } = req.body;

      if (!patient_id) {
        return res.status(400).json({ message: "ID do paciente é obrigatório." });
      }

      await knex("session_records").insert({
        patient_id,
        attended,
        paymentMade,
        paymentAmount,
        notes,
        created_at: knex.fn.now(),
      });

      res.status(201).json({ message: "Sessão adicionada com sucesso." });
    } catch (error) {
      console.error("Erro ao adicionar sessão:", error);
      res.status(500).json({ message: "Erro ao adicionar sessão." });
    }
  }
  async getNotifications(req: Request, res: Response) {
    try {
      const { patient_id } = req.params;
  
      const notifications = await knex("notifications")
        .where({ patient_id })
        .orderBy("created_at", "desc");
  
      return res.status(200).json(notifications);
    } catch (error) {
      const customError: Error = error as Error;
      console.log(customError);
      throw new AppError(customError.message);
    }
  }
  
  async login(req: Request, res: Response) {
    try {
      const { name, phone, fcmToken } = req.body;
  
      if (!name || !phone) {
        throw new AppError("Nome e telefone são obrigatórios.", 400);
      }
  
      // Buscar paciente pelo nome e telefone
      const patient = await knex("patients")
        .where({ name })
        .andWhere({ phone })
        .first();
  
      if (!patient) {
        throw new AppError("Paciente não encontrado.", 404);
      }
  
      // Atualizar o token do dispositivo do paciente no banco de dados (opcional)
      if (fcmToken) {
        await knex("patients").where({ id: patient.id }).update({ fcmToken });
      }
  
      // Retorne informações básicas para o mobile
      return res.status(200).json({
        id: patient.id,
        name: patient.name,
      });
    } catch (error) {
      const customError: Error = error as Error;
      console.log(customError);
      throw new AppError(customError.message);
    }
  }
  
  
}
