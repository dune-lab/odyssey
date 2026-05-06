import { describe, it, itCases, generate, expect } from '@enxoval/testing';
import { fromDbWire, toDbWire } from '../../../src/adapters/journey';
import { JourneyDbWire } from '../../../src/db/wire/journey';
import { Journey, JourneyRecord } from '../../../src/model/journey';

describe('journey adapter — fromDbWire', () => {
  it('fromDbWire maps fields', () => {
    const expected = generate(Journey);

    const wire = new JourneyDbWire();
    wire.id = expected.id;
    wire.student_id = expected.studentId;
    wire.current_step = expected.currentStep;
    wire.status = expected.status;
    wire.created_at = new Date();

    const result = fromDbWire(wire);

    expect(result.id).toBe(expected.id);
    expect(result.studentId).toBe(expected.studentId);
    expect(result.currentStep).toBe(expected.currentStep);
    expect(result.status).toBe(expected.status);
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});

describe('journey adapter — toDbWire', () => {
  itCases('returns a JourneyDbWire instance', JourneyRecord, (input) => {
    expect(toDbWire(input)).toBeInstanceOf(JourneyDbWire);
  });

  itCases('maps student_id, current_step and status', JourneyRecord, (input) => {
    const result = toDbWire(input);
    expect(result.student_id).toBe(input.studentId);
    expect(result.current_step).toBe(input.currentStep);
    expect(result.status).toBe(input.status);
  });

  itCases('does not set id (delegated to DB)', JourneyRecord, (input) => {
    expect(toDbWire(input).id).toBeUndefined();
  });

  itCases('does not set created_at (delegated to DB)', JourneyRecord, (input) => {
    expect(toDbWire(input).created_at).toBeUndefined();
  });
});
