import { asyncFn } from '@enxoval/types';
import { NotFoundError } from '@enxoval/types';
import { publish } from '@enxoval/messaging';
import { Event } from '../model/event';
import { buildEvent } from '../logic/event';
import { buildEventRecord } from '../logic/event-record';
import { buildJourneyStepUpdate } from '../logic/journey';
import * as analysisFinishedDb from '../db/analysis-finished';
import * as curriculumGeneratedDb from '../db/curriculum-generated';
import * as journeyDb from '../db/journey';
import * as journeyEventBus from '../wire/journey-event-bus';

const sideEffect = asyncFn(Event, async (event) => {
  await publish('curriculumGenerated', event);
});

export const analysisFinished = asyncFn(Event, async (event) => {
  const previous = await analysisFinishedDb.findById(event.eventId);
  if (!previous)
    throw new NotFoundError('AnalysisFinished not found for eventId: ' + event.eventId);

  const existing = await curriculumGeneratedDb.findById(event.eventId);
  if (existing) {
    await sideEffect(buildEvent({ journeyId: existing.journeyId, eventId: existing.id }));
    return;
  }

  const current = await curriculumGeneratedDb.insert(buildEventRecord(event));
  await journeyDb.updateStep(
    buildJourneyStepUpdate({ id: previous.journeyId, currentStep: 'CURRICULUM_GENERATED' }),
  );
  journeyEventBus.emit(previous.journeyId, {
    id: previous.journeyId,
    currentStep: 'CURRICULUM_GENERATED',
    status: 'active',
  });
  await sideEffect(buildEvent({ journeyId: current.journeyId, eventId: current.id }));
});
