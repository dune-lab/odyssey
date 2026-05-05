import { Migration, sql, MigrationRunner } from '@enxoval/db';

export class CreateHarkonnenMessagesTable1777200120000 extends Migration {
  name = 'CreateHarkonnenMessagesTable1777200120000';

  async up(runner: MigrationRunner): Promise<void> {
    await sql(
      runner,
      `CREATE TABLE "harkonnen_messages" (
        "id"              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        "original_topic"  VARCHAR     NOT NULL,
        "name"            VARCHAR     NOT NULL,
        "payload"         JSONB       NOT NULL,
        "error"           TEXT        NOT NULL,
        "failed_at"       TIMESTAMPTZ NOT NULL,
        "status"          VARCHAR     NOT NULL DEFAULT 'pending',
        "reprocessed_at"  TIMESTAMPTZ,
        "created_at"      TIMESTAMPTZ NOT NULL DEFAULT now()
      )`,
    );
  }

  async down(runner: MigrationRunner): Promise<void> {
    await sql(runner, `DROP TABLE "harkonnen_messages"`);
  }
}
