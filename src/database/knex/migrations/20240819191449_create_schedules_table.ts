import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("schedules", (table) => {
    table.increments("id").primary();
    table.integer("patient_id").references("id").inTable("patients");
    table.dateTime("schedule_date_time").notNullable();
    table.boolean("isPresencial").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
  await knex.raw(`
    CREATE TRIGGER update_updated_at
    BEFORE UPDATE ON schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TRIGGER IF EXISTS update_updated_at ON schedules;`);
  await knex.schema.dropTable("schedules");
}
