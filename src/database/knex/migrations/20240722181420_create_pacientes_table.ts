import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("patients", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description");
    table.date("date_of_birth").notNullable();
    table.boolean("active").notNullable().defaultTo(true);
    table.string("phone");
    table.string("whatsapp");
    table.dateTime("last_session_date").defaultTo(null);
    table.integer("repeat_days").notNullable().defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").defaultTo(null);
  });
  await knex.raw(`
    CREATE TRIGGER update_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TRIGGER IF EXISTS update_updated_at ON patients;`);
  await knex.schema.dropTable("patients");
}
