import { fn } from '@enxoval/types';
import { toUUID } from '@enxoval/types';
import { Event } from '../model/event';
import { EventWireIn } from '../wire/in/event';

export const toModel = fn(EventWireIn, Event, (wire) => ({
  eventId: toUUID(wire.eventId),
  journeyId: toUUID(wire.journeyId),
}));
