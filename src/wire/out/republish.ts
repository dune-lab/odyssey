import { createSchema, field } from '@enxoval/types';

export const RepublishWireOut = createSchema({
  republished: field.number(),
});
