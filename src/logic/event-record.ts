import { fn } from '@enxoval/types';
import { Event } from '../model/event';
import { EventRecordInput } from '../model/event-record';

export const buildEventRecord = fn(Event, EventRecordInput, (event) => ({
  id: event.eventId,
  journeyId: event.journeyId,
}));
