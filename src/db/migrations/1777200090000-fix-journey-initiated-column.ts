import { Migration, sql, MigrationRunner } from '@enxoval/db';

export class FixJourneyInitiatedColumn1777200090000 extends Migration {
  name = 'FixJourneyInitiatedColumn1777200090000';

  async up(runner: MigrationRunner): Promise<void> {
    await sql(runner, `ALTER TABLE "journey_initiated" RENAME COLUMN "student_id" TO "journey_id"`);
  }

  async down(runner: MigrationRunner): Promise<void> {
    await sql(runner, `ALTER TABLE "journey_initiated" RENAME COLUMN "journey_id" TO "student_id"`);
  }
}
