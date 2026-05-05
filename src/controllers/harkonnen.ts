import { asyncFn, field, NotFoundError } from '@enxoval/types';
import { publishRaw } from '@enxoval/messaging';
import { NoInput, ReprocessOneWireIn, ReprocessAllByTopicWireIn, DismissWireIn } from '../wire/in/harkonnen';
import { ReprocessOneWireOut, ReprocessAllWireOut, DismissWireOut } from '../wire/out/harkonnen';
import { HarkonnenMessage } from '../model/harkonnen-message';
import * as db from '../db/harkonnen-message';

export const listDlqMessages = asyncFn(NoInput, field.array(HarkonnenMessage), async (_) => {
  return db.findAll();
});

export const reprocessDlqOne = asyncFn(ReprocessOneWireIn, ReprocessOneWireOut, async (input) => {
  const msg = await db.findById(input.id);
  if (!msg) throw new NotFoundError(`DLQ message ${input.id} not found`);
  const parsed = JSON.parse(input.payload) as unknown;
  await publishRaw(msg.originalTopic, parsed);
  await db.markReprocessed(input.id);
  return { reprocessed: true };
});

export const reprocessDlqAllByTopic = asyncFn(ReprocessAllByTopicWireIn, ReprocessAllWireOut, async (input) => {
  const messages = await db.findPendingByTopic(input.topic);
  await Promise.all(
    messages.map(async (msg) => {
      await publishRaw(msg.originalTopic, JSON.parse(msg.payload) as unknown);
      await db.markReprocessed(msg.id);
    }),
  );
  return { reprocessed: messages.length };
});

export const dismissDlqMessage = asyncFn(DismissWireIn, DismissWireOut, async (input) => {
  const msg = await db.findById(input.id);
  if (!msg) throw new NotFoundError(`DLQ message ${input.id} not found`);
  await db.markDismissed(input.id);
  return { dismissed: true };
});
