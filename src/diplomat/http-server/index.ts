import { registerJourneyRoutes } from './journey';
import { registerJourneysListRoutes } from './journeys-list';
import { registerRepublishRoutes } from './republish';

export function setupRoutes(): void {
  registerJourneyRoutes();
  registerJourneysListRoutes();
  registerRepublishRoutes();
}
