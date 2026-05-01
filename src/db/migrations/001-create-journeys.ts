import { Migration, MigrationRunner, sql } from '@enxoval/db';

export class CreateJourneys1700000000001 extends Migration {
  name = 'CreateJourneys1700000000001';

  async up(runner: MigrationRunner): Promise<void> {
    await sql(runner, `
      CREATE TABLE IF NOT EXISTS journeys (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL,
        current_step VARCHAR NOT NULL,
        status VARCHAR NOT NULL DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
  }

  async down(runner: MigrationRunner): Promise<void> {
    await sql(runner, `DROP TABLE IF EXISTS journeys`);
  }
}
