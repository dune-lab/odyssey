import { createSchema, field } from '@enxoval/types';

export const Event = createSchema({
  eventId: field.uuid(),
  journeyId: field.uuid(),
});
