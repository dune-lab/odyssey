import { registerJourneyRoutes } from './journey';
import { registerJourneysListRoutes } from './journeys-list';
import { registerRepublishRoutes } from './republish';
import { registerJourneyStreamRoute } from './journey-stream';
import { registerHarkonnenRoutes } from './harkonnen';

export function setupRoutes(): void {
  registerJourneyRoutes();
  registerJourneysListRoutes();
  registerRepublishRoutes();
  registerJourneyStreamRoute();
  registerHarkonnenRoutes();
}
