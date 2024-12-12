import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("session_records", (table) => {
    table.increments("id").primary();
    table.integer("patient_id").references("id").inTable("patients");
    table.string("notes").defaultTo(null);
    table.boolean("is_session_paid").defaultTo(false);
    table.integer("schedule_id").references("id").inTable("schedules");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
  await knex.raw(`
    CREATE TRIGGER update_updated_at
    BEFORE UPDATE ON session_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    `DROP TRIGGER IF EXISTS update_updated_at ON session_records;`
  );
  await knex.schema.dropTable("session_records");
}
