import { Migration, sql } from '@enxoval/db';

export class CreateJourneys001 implements Migration {
  async up(): Promise<void> {
    await sql(`
      CREATE TABLE IF NOT EXISTS journeys (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL,
        current_step VARCHAR NOT NULL,
        status VARCHAR NOT NULL DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
  }

  async down(): Promise<void> {
    await sql(`DROP TABLE IF EXISTS journeys`);
  }
}
