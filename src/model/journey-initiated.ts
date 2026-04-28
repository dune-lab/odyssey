import { createSchema, field } from '@enxoval/types';

export const JourneyInitiated = createSchema({
  id: field.uuid(),
  journeyId: field.uuid(),
  createdAt: field.date(),
});

export const JourneyInitiatedInput = createSchema({
  journeyId: field.uuid(),
});
