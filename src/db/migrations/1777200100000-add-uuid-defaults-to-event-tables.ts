import { Migration, sql, MigrationRunner } from '@enxoval/db';

const EVENT_TABLES = [
  'journey_initiated',
  'diagnostic_triggered',
  'diagnostic_completed',
  'analysis_started',
  'analysis_finished',
  'curriculum_generated',
  'content_dispatched',
  'student_engagement_received',
  'progress_milestone_reached',
  'journey_completed',
];

export class AddUuidDefaultsToEventTables1777200100000 extends Migration {
  name = 'AddUuidDefaultsToEventTables1777200100000';

  async up(runner: MigrationRunner): Promise<void> {
    for (const table of EVENT_TABLES) {
      await sql(runner, `ALTER TABLE "${table}" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
    }
  }

  async down(runner: MigrationRunner): Promise<void> {
    for (const table of EVENT_TABLES) {
      await sql(runner, `ALTER TABLE "${table}" ALTER COLUMN "id" DROP DEFAULT`);
    }
  }
}
