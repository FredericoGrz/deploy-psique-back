import knex from "../database/knex";
import { Request, Response } from "express";
import AppError from "../utils/AppError";
import admin from "../configs/firebase"; // Configuração do Firebase Admin

export default class ScheduleController {
  async index(req: Request, res: Response) {
    try {
      const schedulesWithPatients = await knex("schedules")
        .innerJoin("patients", "schedules.patient_id", "patients.id")
        .select(
          "schedules.*",
          "patients.id as patient_id",
          "patients.name as patient_name",
          "patients.whatsapp as patient_whatsapp"
        )
        .orderBy("schedules.schedule_date_time");

      res.status(200).json(schedulesWithPatients);
    } catch (error) {
      const customError: Error = error as Error;
      console.log(customError);
      throw new AppError(customError.message);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { patient_id, schedule_dateTime, isPresencial } = req.body;
  
      if (!patient_id || !schedule_dateTime || isPresencial === undefined) {
        return res.status(400).json({ error: "Por favor preencha todos os campos" });
      }
  
      // Verifica se o paciente existe
      const patient = await knex("patients").where({ id: patient_id }).first();
      if (!patient) throw new AppError("Paciente não encontrado");
  
      // Insere o agendamento no banco de dados
      const newSchedule = await knex("schedules").insert({
        patient_id,
        isPresencial,
        schedule_date_time: schedule_dateTime,
      });
  
      // Insere a notificação no banco de dados
      await knex("notifications").insert({
        patient_id,
        message: `Sua consulta foi marcada para ${schedule_dateTime}.`,
        created_at: knex.fn.now(),
      });
  
      // Envia a notificação push se o token do dispositivo estiver presente
      if (patient.fcmToken) {
        await this.sendPushNotification(
          patient.fcmToken,
          `Sua consulta foi marcada para ${schedule_dateTime}.`
        );
      }
  
      res.status(201).json({ message: "Agendamento criado com sucesso!", schedule: newSchedule });
    } catch (error) {
      const customError: Error = error as Error;
      console.log(customError);
      res.status(500).json({ error: customError.message });
    }
  }
  
  

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { schedule_dateTime, isPresencial } = req.body;

      if (!schedule_dateTime) {
        return res.status(400).json({ error: "Por favor preencha todos os campos" });
      }

      const scheduleExists = await knex("schedules").where({ id }).first();
      if (!scheduleExists) throw new AppError("Agendamento não encontrado");

      await knex("schedules")
        .where({ id })
        .update({ isPresencial, schedule_date_time: schedule_dateTime });

      res.status(204).json({ message: "Agendamento atualizado com sucesso!" });
    } catch (error) {
      const customError: Error = error as Error;
      console.log(customError);
      res.status(500).json({ error: customError.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const scheduleExists = await knex("schedules").where({ id }).first();
      if (!scheduleExists) throw new AppError("Agendamento não encontrado");

      await knex("schedules").where({ id }).delete();

      res.status(204).json({ message: "Agendamento deletado com sucesso!" });
    } catch (error) {
      const customError: Error = error as Error;
      console.log(customError);
      res.status(500).json({ error: customError.message });
    }
  }

  // Função para enviar notificações push
  private async sendPushNotification(token: string, message: string) {
    try {
      await admin.messaging().send({
        token,
        notification: {
          title: "Novo Agendamento",
          body: message,
        },
      });
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
    }
  }
}
