import { describe, it, expect } from '@enxoval/testing';
import { fromDbWire, toDbWire } from '../../../src/adapters/journey-completed';
import { JourneyCompletedDbWire } from '../../../src/db/wire/journey-completed';

const journeyId = '11111111-1111-1111-1111-111111111111';
const id = '00000004-0000-0000-0000-000000000004';

describe('journey-completed adapter — fromDbWire', () => {
  it('maps snake_case db columns to camelCase model', () => {
    const wire = new JourneyCompletedDbWire();
    wire.id = id;
    wire.journey_id = journeyId;
    wire.created_at = new Date('2024-01-01');

    expect(fromDbWire(wire)).toEqual({ id, journeyId, createdAt: new Date('2024-01-01') });
  });
});

describe('journey-completed adapter — toDbWire', () => {
  it('returns a JourneyCompletedDbWire instance', () => {
    expect(toDbWire({ id, journeyId })).toBeInstanceOf(JourneyCompletedDbWire);
  });

  it('maps fields correctly', () => {
    const result = toDbWire({ id, journeyId });
    expect(result.id).toBe(id);
    expect(result.journey_id).toBe(journeyId);
  });

  it('does not set created_at (delegated to DB)', () => {
    expect(toDbWire({ id, journeyId }).created_at).toBeUndefined();
  });
});
