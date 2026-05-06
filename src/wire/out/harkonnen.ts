import { createSchema, field } from '@enxoval/types';

export const ReprocessOneWireOut = createSchema({
  id: field.uuid(),
  payload: field.string(),
});

export const ReprocessAllWireOut = createSchema({
  reprocessed: field.number(),
});

export const DismissWireOut = createSchema({
  id: field.uuid(),
});
