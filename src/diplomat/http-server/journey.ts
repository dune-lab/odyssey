import { fn } from '@enxoval/types';
import { post } from '@enxoval/http';
import { StartJourneyWireIn } from '../../wire/in/journey';
import { JourneyWireOut } from '../../wire/out/journey';
import { Journey } from '../../model/journey';
import { startJourney } from '../../controllers/journey';

const toWireOut = fn(Journey, JourneyWireOut, (j) => ({
  id: j.id,
  studentId: j.studentId,
  currentStep: j.currentStep,
  status: j.status,
  createdAt: j.createdAt.toISOString(),
}));

export function registerJourneyRoutes(): void {
  post('/journeys', async (body) => {
    const input = StartJourneyWireIn.parse(body);
    const journey = await startJourney(input);
    return toWireOut(journey);
  });
}
