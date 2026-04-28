import { describe, it, expect } from '@enxoval/testing';
import { fromDbWire, toDbWire } from '../../../src/adapters/diagnostic-triggered';
import { DiagnosticTriggeredDbWire } from '../../../src/db/wire/diagnostic-triggered';

const journeyId = '11111111-1111-1111-1111-111111111111';
const id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

describe('diagnostic-triggered adapter — fromDbWire', () => {
  it('maps snake_case db columns to camelCase model', () => {
    const wire = new DiagnosticTriggeredDbWire();
    wire.id = id;
    wire.journey_id = journeyId;
    wire.created_at = new Date('2024-01-01');

    expect(fromDbWire(wire)).toEqual({ id, journeyId, createdAt: new Date('2024-01-01') });
  });
});

describe('diagnostic-triggered adapter — toDbWire', () => {
  it('returns a DiagnosticTriggeredDbWire instance', () => {
    expect(toDbWire({ id, journeyId })).toBeInstanceOf(DiagnosticTriggeredDbWire);
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
