import { Request, Response } from "express";
import knex from "../database/knex";

export class SessionRecordsController {
  async create(req: Request, res: Response) {
    const { patient_id } = req.params;
    const { schedule_id, attended, paymentmade, paymentamount, notes } = req.body;

    const [sessionId] = await knex("session_records").insert({
      patient_id,
      schedule_id,
      attended,
      paymentmade,
      paymentamount,
      notes,
    }).returning("id");

    res.status(201).json({ id: sessionId });
  }

  async index(req: Request, res: Response) {
    const { patient_id } = req.params;
  
    const sessions = await knex("session_records")
      .where({ patient_id })
      .select(
        "id",
        "created_at",
        "attended",
        "paymentmade",
        "paymentamount",
        "notes"
      );
  
    res.json(sessions);
  }
  
}
