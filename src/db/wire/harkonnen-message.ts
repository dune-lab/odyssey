import { defineEntity, column, SchemaDefinition } from '@enxoval/db';

/**
 * HarkonnenMessageDbWire
 *
 * Database entity representing a message that failed to be processed by Kafka
 * and was sent to the Dead Letter Queue (DLQ). This entity stores the original
 * message details, error information, and reprocessing status.
 */
export class HarkonnenMessageDbWire {
  id!: string;
  original_topic!: string;
  name!: string;
  payload!: object;
  error!: string;
  failed_at!: Date;
  status!: string;
  reprocessed_at!: Date | null;
  created_at!: Date;

  static parse(data: unknown): HarkonnenMessageDbWire {
    return Object.assign(new HarkonnenMessageDbWire(), data);
  }
}

/**
 * HarkonnenMessageSchema
 *
 * TypeORM schema definition for the harkonnen_messages table.
 * Maps database columns to the HarkonnenMessageDbWire entity.
 */
export const HarkonnenMessageSchema: SchemaDefinition<HarkonnenMessageDbWire> = defineEntity(
  HarkonnenMessageDbWire,
  {
    tableName: 'harkonnen_messages',
    columns: {
      id: column.primaryUuid(),
      original_topic: column.varchar(),
      name: column.varchar(),
      payload: { type: 'jsonb' },
      error: { type: 'text' },
      failed_at: { type: 'timestamptz' },
      status: column.varchar(),
      reprocessed_at: { type: 'timestamptz', nullable: true },
      created_at: column.createdAt(),
    },
  },
);
