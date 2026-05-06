import { describe, it, itCases, generate, expect } from '@enxoval/testing';
import { fromDbWire, toDbWire } from '../../../src/adapters/journey-initiated';
import { JourneyInitiatedDbWire } from '../../../src/db/wire/journey-initiated';
import { JourneyInitiated, JourneyInitiatedInput } from '../../../src/model/journey-initiated';

describe('journey-initiated adapter — fromDbWire', () => {
  it('fromDbWire maps fields', () => {
    const expected = generate(JourneyInitiated);

    const wire = new JourneyInitiatedDbWire();
    wire.id = expected.id;
    wire.journey_id = expected.journeyId;
    wire.created_at = new Date();

    const result = fromDbWire(wire);

    expect(result.id).toBe(expected.id);
    expect(result.journeyId).toBe(expected.journeyId);
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});

describe('journey-initiated adapter — toDbWire', () => {
  itCases('returns a JourneyInitiatedDbWire instance', JourneyInitiatedInput, (input) => {
    expect(toDbWire(input)).toBeInstanceOf(JourneyInitiatedDbWire);
  });

  itCases('maps journeyId to journey_id', JourneyInitiatedInput, (input) => {
    expect(toDbWire(input).journey_id).toBe(input.journeyId);
  });

  itCases('does not set id (delegated to DB)', JourneyInitiatedInput, (input) => {
    expect(toDbWire(input).id).toBeUndefined();
  });

  itCases('does not set created_at (delegated to DB)', JourneyInitiatedInput, (input) => {
    expect(toDbWire(input).created_at).toBeUndefined();
  });
});
