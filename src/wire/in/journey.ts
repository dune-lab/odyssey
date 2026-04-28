import { createSchema, field } from '@enxoval/types';

export const StartJourneyWireIn = createSchema({
  studentId: field.uuid(),
});
