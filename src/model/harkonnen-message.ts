import { createSchema, field } from '@enxoval/types';

export const HARKONNEN_STATUSES = ['pending', 'reprocessed', 'dismissed'] as const;

/**
 * HarkonnenMessage
 *
 * Domain model for a Dead Letter Queue (DLQ) message. This schema represents
 * a message that failed processing and was stored for manual inspection and reprocessing.
 *
 * The payload field is exposed as a string (JSON) to allow frontend editing in a textarea.
 * Timestamps are strings: model is the direct API response shape with no toWireOut conversion step.
 */
export const HarkonnenMessage = createSchema({
  id: field.uuid(),
  originalTopic: field.string(),
  name: field.string(),
  payload: field.string(),
  error: field.string(),
  failedAt: field.string(),
  status: field.literal(...HARKONNEN_STATUSES),
  reprocessedAt: field.nullable(field.string()),
  createdAt: field.string(),
});

/**
 * HarkonnenMessageInput
 *
 * Input schema for creating a new harkonnen message entry. Used when accepting
 * DLQ messages and storing them for reprocessing.
 */
export const HarkonnenMessageInput = createSchema({
  originalTopic: field.string(),
  name: field.string(),
  payload: field.string(),
  error: field.string(),
  failedAt: field.string(),
});
