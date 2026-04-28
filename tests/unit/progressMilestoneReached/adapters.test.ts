import { describe, it, expect } from '@enxoval/testing';
import { fromDbWire, toDbWire } from '../../../src/adapters/progress-milestone-reached';
import { ProgressMilestoneReachedDbWire } from '../../../src/db/wire/progress-milestone-reached';

const journeyId = '11111111-1111-1111-1111-111111111111';
const id = '00000003-0000-0000-0000-000000000003';

describe('progress-milestone-reached adapter — fromDbWire', () => {
  it('maps snake_case db columns to camelCase model', () => {
    const wire = new ProgressMilestoneReachedDbWire();
    wire.id = id;
    wire.journey_id = journeyId;
    wire.created_at = new Date('2024-01-01');

    expect(fromDbWire(wire)).toEqual({ id, journeyId, createdAt: new Date('2024-01-01') });
  });
});

describe('progress-milestone-reached adapter — toDbWire', () => {
  it('returns a ProgressMilestoneReachedDbWire instance', () => {
    expect(toDbWire({ id, journeyId })).toBeInstanceOf(ProgressMilestoneReachedDbWire);
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
