import { describe, it, expect } from '@enxoval/testing';
import { fromDbWire, toDbWire } from '../../../src/adapters/curriculum-generated';
import { CurriculumGeneratedDbWire } from '../../../src/db/wire/curriculum-generated';

const journeyId = '11111111-1111-1111-1111-111111111111';
const id = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

describe('curriculum-generated adapter — fromDbWire', () => {
  it('maps snake_case db columns to camelCase model', () => {
    const wire = new CurriculumGeneratedDbWire();
    wire.id = id;
    wire.journey_id = journeyId;
    wire.created_at = new Date('2024-01-01');

    expect(fromDbWire(wire)).toEqual({ id, journeyId, createdAt: new Date('2024-01-01') });
  });
});

describe('curriculum-generated adapter — toDbWire', () => {
  it('returns a CurriculumGeneratedDbWire instance', () => {
    expect(toDbWire({ id, journeyId })).toBeInstanceOf(CurriculumGeneratedDbWire);
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
