import { describe, it, expect } from '@enxoval/testing';
import { fromDbWire, toDbWire } from '../../../src/adapters/journey';
import { JourneyDbWire } from '../../../src/db/wire/journey';

const journeyId = '11111111-1111-1111-1111-111111111111';
const studentId = '22222222-2222-2222-2222-222222222222';

describe('journey adapter — fromDbWire', () => {
  it('maps snake_case db columns to camelCase model', () => {
    const wire = new JourneyDbWire();
    wire.id = journeyId;
    wire.student_id = studentId;
    wire.current_step = 'JOURNEY_INITIATED';
    wire.status = 'active';
    wire.created_at = new Date('2024-01-01');

    expect(fromDbWire(wire)).toEqual({
      id: journeyId,
      studentId,
      currentStep: 'JOURNEY_INITIATED',
      status: 'active',
      createdAt: new Date('2024-01-01'),
    });
  });
});

describe('journey adapter — toDbWire', () => {
  it('returns a JourneyDbWire instance', () => {
    const result = toDbWire({ studentId, currentStep: 'JOURNEY_INITIATED', status: 'active' });
    expect(result).toBeInstanceOf(JourneyDbWire);
  });

  it('maps fields correctly', () => {
    const result = toDbWire({ studentId, currentStep: 'JOURNEY_INITIATED', status: 'active' });
    expect(result.student_id).toBe(studentId);
    expect(result.current_step).toBe('JOURNEY_INITIATED');
    expect(result.status).toBe('active');
  });

  it('does not set id (delegated to DB)', () => {
    const result = toDbWire({ studentId, currentStep: 'JOURNEY_INITIATED', status: 'active' });
    expect(result.id).toBeUndefined();
  });

  it('does not set created_at (delegated to DB)', () => {
    const result = toDbWire({ studentId, currentStep: 'JOURNEY_INITIATED', status: 'active' });
    expect(result.created_at).toBeUndefined();
  });
});
