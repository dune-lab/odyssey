import { sseRoute } from '@enxoval/http';
import * as journeyEventBus from '../../wire/journey-event-bus';

export function registerJourneyStreamRoute(): void {
  sseRoute<{ journeyId: string }, Record<string, never>>(
    '/journeys/:journeyId/stream',
    async ({ journeyId }, _query, send, signal) => {
      const listener = (update: journeyEventBus.JourneyUpdate) => send(update);
      journeyEventBus.on(journeyId, listener);
      await new Promise<void>((resolve) => {
        signal.addEventListener('abort', () => {
          journeyEventBus.off(journeyId, listener);
          resolve();
        });
      });
    },
  );
}
