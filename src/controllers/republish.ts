import { asyncFn } from '@enxoval/types';
import { RepublishWireIn } from '../wire/in/republish';
import { RepublishWireOut } from '../wire/out/republish';
import { publish } from '@enxoval/messaging';
import { Event } from '../model/event';
import { buildEvent } from '../logic/event';
import { buildJourneyInitiated } from '../logic/journey-initiated';
import * as journeyDb from '../db/journey';
import * as journeyInitiatedDb from '../db/journey-initiated';

const sideEffect = asyncFn(Event, async (event) => {
  await publish('journeyInitiated', event);
});

export const republishStuckJourneys = asyncFn(RepublishWireIn, RepublishWireOut, async () => {
  const journeys = await journeyDb.findAll();
  const active = journeys.filter((j) => j.status === 'active');

  const checks = await Promise.all(
    active.map((journey) => journeyInitiatedDb.findByJourneyId(journey.id)),
  );

  let republished = 0;

  await Promise.all(
    active.map(async (journey, i) => {
      const existing = checks[i];

      if (!existing) {
        // Never started: create record and publish
        const record = await journeyInitiatedDb.insert(buildJourneyInitiated(journey));
        await sideEffect(buildEvent({ journeyId: record.journeyId, eventId: record.id }));
        republished++;
        return;
      }

      // Started but consumer never advanced: re-publish with existing record id
      if (journey.currentStep === 'JOURNEY_INITIATED') {
        await sideEffect(buildEvent({ journeyId: existing.journeyId, eventId: existing.id }));
        republished++;
      }
    }),
  );

  return { republished };
});
