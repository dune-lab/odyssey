import { createSchema, field } from '@enxoval/types';

export const ReprocessOneWireIn = createSchema({
  id:      field.uuid(),
  payload: field.string(),
});

export const ReprocessAllByTopicWireIn = createSchema({
  topic: field.string(),
});

export const DismissWireIn = createSchema({
  id: field.uuid(),
});

export const NoInput = createSchema({});
