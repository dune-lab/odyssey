import { createSchema, field } from '@enxoval/types';

export const EventWireIn = createSchema({
  eventId: field.string(),
  journeyId: field.string(),
});
