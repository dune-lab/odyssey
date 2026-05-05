import { asyncFn } from '@enxoval/types';
import { publish } from '@enxoval/messaging';
import { JourneyInput, Journey } from '../model/journey';
import { Event } from '../model/event';
import { buildJourney } from '../logic/journey';
import { buildJourneyInitiated } from '../logic/journey-initiated';
import { buildEvent } from '../logic/event';
import * as journeyDb from '../db/journey';
import * as journeyInitiatedDb from '../db/journey-initiated';

const sideEffect = asyncFn(Event, async (event) => {
  await publish('journeyInitiated', event);
});

export const startJourney = asyncFn(JourneyInput, Journey, async (input) => {
  const journey = await journeyDb.insert(buildJourney({ studentId: input.studentId }));
  const journeyInitiated = await journeyInitiatedDb.insert(buildJourneyInitiated(journey));
  await sideEffect(
    buildEvent({ journeyId: journeyInitiated.journeyId, eventId: journeyInitiated.id }),
  );
  return journey;
});
