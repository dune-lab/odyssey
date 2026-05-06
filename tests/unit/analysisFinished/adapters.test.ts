/**
 * adapters.test.ts — Unit tests for the analysis-finished adapter (fromDbWire / toDbWire).
 *
 * Uses generate() to produce a random valid EventRecord instance for fromDbWire
 * and itCases() to run property-based assertions over random EventRecordInput values
 * for toDbWire.
 */

import { describe, it, itCases, generate, expect } from '@enxoval/testing';
import { fromDbWire, toDbWire } from '../../../src/adapters/analysis-finished';
import { AnalysisFinishedDbWire } from '../../../src/db/wire/analysis-finished';
import { EventRecord, EventRecordInput } from '../../../src/model/event-record';

// ---------------------------------------------------------------------------
// fromDbWire
// ---------------------------------------------------------------------------

describe('analysis-finished adapter — fromDbWire', () => {
  it('maps snake_case db columns to camelCase model', () => {
    const expected = generate(EventRecord);

    const wire = new AnalysisFinishedDbWire();
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

describe('analysis-finished adapter — toDbWire', () => {
  itCases('returns an AnalysisFinishedDbWire instance', EventRecordInput, (input) => {
    expect(toDbWire(input)).toBeInstanceOf(AnalysisFinishedDbWire);
  });

  itCases('maps id and journeyId to id and journey_id', EventRecordInput, (input) => {
    const result = toDbWire(input);
    expect(result.id).toBe(input.id);
    expect(result.journey_id).toBe(input.journeyId);
  });

  itCases('does not set created_at (delegated to DB)', EventRecordInput, (input) => {
    expect(toDbWire(input).created_at).toBeUndefined();
  });
});
