import { post } from '@enxoval/http';
import { republishStuckJourneys } from '../../controllers/republish';
import { RepublishWireOut } from '../../wire/out/republish';

export function registerRepublishRoutes(): void {
  post('/journeys/republish', async () => republishStuckJourneys({}), { in: null, out: { schema: RepublishWireOut, name: 'RepublishWireOut' } });
}
