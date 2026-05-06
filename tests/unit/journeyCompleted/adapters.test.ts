/**
 * adapters.test.ts — Unit tests for the journey-completed adapter (fromDbWire / toDbWire).
 *
 * Uses generate() to produce a random valid EventRecord instance for fromDbWire
 * and itCases() to run property-based assertions over random EventRecordInput values
 * for toDbWire.
 */

import { describe, it, itCases, generate, expect } from '@enxoval/testing';
import { fromDbWire, toDbWire } from '../../../src/adapters/journey-completed';
import { JourneyCompletedDbWire } from '../../../src/db/wire/journey-completed';
import { EventRecord, EventRecordInput } from '../../../src/model/event-record';

// ---------------------------------------------------------------------------
// fromDbWire
// ---------------------------------------------------------------------------

describe('journey-completed adapter — fromDbWire', () => {
  it('fromDbWire maps fields', () => {
    const expected = generate(EventRecord);

    const wire = new JourneyCompletedDbWire();
    wire.id = expected.id;
    wire.journey_id = expected.journeyId;
    wire.created_at = new Date();

    const result = fromDbWire(wire);

    expect(result.id).toBe(expected.id);
    expect(result.journeyId).toBe(expected.journeyId);
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});

// ---------------------------------------------------------------------------
// toDbWire
// ---------------------------------------------------------------------------

describe('journey-completed adapter — toDbWire', () => {
  itCases('returns a JourneyCompletedDbWire instance', EventRecordInput, (input) => {
    expect(toDbWire(input)).toBeInstanceOf(JourneyCompletedDbWire);
  });

  itCases('maps id and journey_id', EventRecordInput, (input) => {
    const result = toDbWire(input);
    expect(result.id).toBe(input.id);
    expect(result.journey_id).toBe(input.journeyId);
  });

  itCases('does not set created_at (delegated to DB)', EventRecordInput, (input) => {
    expect(toDbWire(input).created_at).toBeUndefined();
  });
});
