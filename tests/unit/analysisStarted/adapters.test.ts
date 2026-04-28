import { describe, it, expect } from '@enxoval/testing';
import { fromDbWire, toDbWire } from '../../../src/adapters/analysis-started';
import { AnalysisStartedDbWire } from '../../../src/db/wire/analysis-started';

const journeyId = '11111111-1111-1111-1111-111111111111';
const id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

describe('analysis-started adapter — fromDbWire', () => {
  it('maps snake_case db columns to camelCase model', () => {
    const wire = new AnalysisStartedDbWire();
    wire.id = id;
    wire.journey_id = journeyId;
    wire.created_at = new Date('2024-01-01');

    expect(fromDbWire(wire)).toEqual({ id, journeyId, createdAt: new Date('2024-01-01') });
  });
});

describe('analysis-started adapter — toDbWire', () => {
  it('returns an AnalysisStartedDbWire instance', () => {
    expect(toDbWire({ id, journeyId })).toBeInstanceOf(AnalysisStartedDbWire);
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
