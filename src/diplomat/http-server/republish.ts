import { post } from '@enxoval/http';
import { republishStuckJourneys } from '../../controllers/republish';

export function registerRepublishRoutes(): void {
  post('/journeys/republish', async () => republishStuckJourneys({}));
}
