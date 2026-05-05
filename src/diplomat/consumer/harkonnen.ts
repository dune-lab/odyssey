import { kafka } from '@enxoval/messaging';
import { logger } from '@enxoval/observability';
import { insert } from '../../db/harkonnen-message';

const DLQ_TOPIC = 'student-journey-dlq';

/**
 * Sets up the Harkonnen DLQ consumer to listen for failed messages from the student-journey topic.
 *
 * This consumer reads messages from the dead letter queue (DLQ) and stores them in the harkonnen
 * database for later inspection and recovery. Unlike the standard subscribe() function, this uses
 * kafka.consumer() directly to avoid retry logic that would create an infinite DLQ loop.
 *
 * The consumer group 'odyssey-harkonnen-dlq' reads all historical DLQ messages on first start,
 * then continues to consume new messages as they arrive.
 */
export async function setupHarkonnenConsumer(): Promise<void> {
  const consumer = kafka.consumer({ groupId: 'odyssey-harkonnen-dlq' });
  await consumer.connect();
  await consumer.subscribe({ topic: DLQ_TOPIC, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const raw = message.value?.toString();
      if (!raw) return;
      const data = JSON.parse(raw) as {
        originalTopic: string;
        name: string;
        payload: unknown;
        error: string;
        failedAt: string;
      };
      logger.info({ topic: DLQ_TOPIC, name: data.name }, 'harkonnen: DLQ message received');
      await insert({
        originalTopic: data.originalTopic,
        name: data.name,
        payload: JSON.stringify(data.payload),
        error: data.error,
        failedAt: data.failedAt,
      });
    },
  });
}
