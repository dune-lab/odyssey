import { describe, it, expect } from '@enxoval/testing';
import { fromDbWire, toDbWire } from '../../../src/adapters/journey-initiated';
import { JourneyInitiatedDbWire } from '../../../src/db/wire/journey-initiated';

const journeyId = '11111111-1111-1111-1111-111111111111';
const id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

describe('journey-initiated adapter — fromDbWire', () => {
  it('maps snake_case db columns to camelCase model', () => {
    const wire = new JourneyInitiatedDbWire();
    wire.id = id;
    wire.journey_id = journeyId;
    wire.created_at = new Date('2024-01-01');

    expect(fromDbWire(wire)).toEqual({
      id,
      journeyId,
      createdAt: new Date('2024-01-01'),
    });
  });
});

describe('journey-initiated adapter — toDbWire', () => {
  it('returns a JourneyInitiatedDbWire instance', () => {
    const result = toDbWire({ journeyId });
    expect(result).toBeInstanceOf(JourneyInitiatedDbWire);
  });

  it('maps journeyId to journey_id', () => {
    const result = toDbWire({ journeyId });
    expect(result.journey_id).toBe(journeyId);
  });

  it('does not set id (delegated to DB)', () => {
    const result = toDbWire({ journeyId });
    expect(result.id).toBeUndefined();
  });

  it('does not set created_at (delegated to DB)', () => {
    const result = toDbWire({ journeyId });
    expect(result.created_at).toBeUndefined();
  });
});
