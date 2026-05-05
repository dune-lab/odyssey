/**
 * Database module for HarkonnenMessage
 *
 * Provides CRUD operations for the harkonnen_messages table via TypeORM.
 * Mutations use asyncFn pattern (insert). Queries use plain async functions.
 *
 * Dependencies:
 * - AppDataSource: TypeORM data source from ./data-source
 * - HarkonnenMessageDbWire: Entity model from ./wire/harkonnen-message
 * - HarkonnenMessage, HarkonnenMessageInput: Domain models from ../model/harkonnen-message
 * - fromDbWire, toDbWire: Adapters from ../adapters/harkonnen-message
 * - asyncFn: Mutation pattern from @enxoval/types
 */

import { asyncFn, type UUID } from '@enxoval/types';
import { AppDataSource } from './data-source';
import { HarkonnenMessageDbWire } from './wire/harkonnen-message';
import { HarkonnenMessage, HarkonnenMessageInput } from '../model/harkonnen-message';
import { fromDbWire, toDbWire } from '../adapters/harkonnen-message';

/**
 * Helper to get the HarkonnenMessage repository instance from TypeORM
 */
const repo = () => AppDataSource.getRepository(HarkonnenMessageDbWire);

/**
 * Insert a new harkonnen message into the database
 *
 * Input: HarkonnenMessageInput (domain model)
 * Output: HarkonnenMessage (domain model)
 * Pattern: asyncFn (mutation)
 */
export const insert = asyncFn(HarkonnenMessageInput, HarkonnenMessage, async (input) => {
  const row = await repo().save(toDbWire(input));
  return fromDbWire(row);
});

/**
 * Find all harkonnen messages, ordered by most recent first
 *
 * Returns: Array of HarkonnenMessage (domain model)
 * Order: created_at DESC
 */
export async function findAll(): Promise<ReturnType<typeof HarkonnenMessage.parse>[]> {
  const rows = await repo().find({ order: { created_at: 'DESC' } });
  return rows.map(fromDbWire);
}

/**
 * Find a harkonnen message by ID
 *
 * Input: id (UUID)
 * Returns: HarkonnenMessage | null
 */
export async function findById(
  id: UUID,
): Promise<ReturnType<typeof HarkonnenMessage.parse> | null> {
  const row = await repo().findOne({ where: { id } });
  return row ? fromDbWire(row) : null;
}

/**
 * Find all pending messages for a given original topic
 *
 * Used to locate messages that failed processing and need reprocessing
 *
 * Input: topic (string — original Kafka topic)
 * Returns: Array of HarkonnenMessage with status='pending'
 */
export async function findPendingByTopic(
  topic: string,
): Promise<ReturnType<typeof HarkonnenMessage.parse>[]> {
  const rows = await repo().find({ where: { original_topic: topic, status: 'pending' } });
  return rows.map(fromDbWire);
}

/**
 * Mark a harkonnen message as reprocessed
 *
 * Updates status to 'reprocessed' and sets reprocessed_at timestamp
 *
 * Input: id (UUID)
 */
export async function markReprocessed(id: UUID): Promise<void> {
  await repo().update({ id }, { status: 'reprocessed', reprocessed_at: new Date() });
}

/**
 * Mark a harkonnen message as dismissed
 *
 * Updates status to 'dismissed' (message is acknowledged and no longer pending)
 *
 * Input: id (UUID)
 */
export async function markDismissed(id: UUID): Promise<void> {
  await repo().update({ id }, { status: 'dismissed' });
}
