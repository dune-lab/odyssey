import { fn, asUUID } from '@enxoval/types';
import { HarkonnenMessage, HarkonnenMessageInput, HARKONNEN_STATUSES } from '../model/harkonnen-message';
import { HarkonnenMessageDbWire } from '../db/wire/harkonnen-message';

/**
 * fromDbWire
 *
 * Adapter function that converts a database entity (HarkonnenMessageDbWire) to
 * the domain model (HarkonnenMessage). Transforms snake_case DB columns to camelCase
 * and converts object payload to JSON string for API exposure.
 */
export const fromDbWire = fn(HarkonnenMessageDbWire, HarkonnenMessage, (wire) => ({
  id:             asUUID(wire.id),
  originalTopic:  wire.original_topic,
  name:           wire.name,
  payload:        JSON.stringify(wire.payload),
  error:          wire.error,
  failedAt:       wire.failed_at.toISOString(),
  status:         wire.status as typeof HARKONNEN_STATUSES[number],
  reprocessedAt:  wire.reprocessed_at ? wire.reprocessed_at.toISOString() : null,
  createdAt:      wire.created_at.toISOString(),
}));

/**
 * toDbWire
 *
 * Adapter function that converts an input model (HarkonnenMessageInput) to
 * a database entity (HarkonnenMessageDbWire). Transforms camelCase input fields
 * to snake_case DB columns, parses JSON payload string to object, and sets
 * default values for fields not provided in input.
 */
export const toDbWire = fn(HarkonnenMessageInput, HarkonnenMessageDbWire, (input) => {
  const row = new HarkonnenMessageDbWire();
  row.original_topic = input.originalTopic;
  row.name           = input.name;
  row.payload        = JSON.parse(input.payload) as object;
  row.error          = input.error;
  row.failed_at      = new Date(input.failedAt);
  row.status         = 'pending';
  return row;
});
