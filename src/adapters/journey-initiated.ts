import { fn } from '@enxoval/types';
import { JourneyInitiated, JourneyInitiatedInput } from '../model/journey-initiated';
import { JourneyInitiatedDbWire } from '../db/wire/journey-initiated';
import { asUUID } from '@enxoval/types';

export const fromDbWire = fn(JourneyInitiatedDbWire, JourneyInitiated, (wire) => ({
  id: asUUID(wire.id),
  journeyId: asUUID(wire.journey_id),
  createdAt: wire.created_at,
}));

export const toDbWire = fn(JourneyInitiatedInput, JourneyInitiatedDbWire, (input) => {
  const row = new JourneyInitiatedDbWire();
  row.journey_id = input.journeyId;
  return row;
});
