import { fn, NotFoundError } from '@enxoval/types';
import { post, getWith } from '@enxoval/http';
import { StartJourneyWireIn } from '../../wire/in/journey';
import { JourneyWireOut } from '../../wire/out/journey';
import { Journey } from '../../model/journey';
import { startJourney } from '../../controllers/journey';
import * as journeyDb from '../../db/journey';

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

  getWith<{ studentId: string }>('/journeys/by-student/:studentId', async ({ studentId }) => {
    const journey = await journeyDb.findByStudentId(studentId);
    if (!journey) throw new NotFoundError(`Journey for student ${studentId} not found`);
    return toWireOut(journey);
  });
}
