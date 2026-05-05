import { createSchema, field } from '@enxoval/types';

export const ReprocessOneWireOut = createSchema({
  reprocessed: field.boolean(),
});

export const ReprocessAllWireOut = createSchema({
  reprocessed: field.number(),
});

export const DismissWireOut = createSchema({
  dismissed: field.boolean(),
});
