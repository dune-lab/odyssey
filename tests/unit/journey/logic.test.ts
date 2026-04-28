import { describe, it, expect } from '@enxoval/testing';
import { buildJourney, buildJourneyStepUpdate, buildJourneyStatusUpdate } from '../../../src/logic/journey';

const studentId = '22222222-2222-2222-2222-222222222222';
const journeyId = '11111111-1111-1111-1111-111111111111';

describe('buildJourney', () => {
  it('sets initial step to JOURNEY_INITIATED', () => {
    const result = buildJourney({ studentId });
    expect(result.currentStep).toBe('JOURNEY_INITIATED');
  });

  it('sets initial status to active', () => {
    const result = buildJourney({ studentId });
    expect(result.status).toBe('active');
  });

  it('carries studentId through', () => {
    const result = buildJourney({ studentId });
    expect(result.studentId).toBe(studentId);
  });

  it('does not generate id', () => {
    const result = buildJourney({ studentId });
    expect((result as Record<string, unknown>).id).toBeUndefined();
  });
});

describe('buildJourneyStepUpdate', () => {
  it('returns input unchanged', () => {
    const input = { id: journeyId, currentStep: 'DIAGNOSTIC_TRIGGERED' as const };
    expect(buildJourneyStepUpdate(input)).toEqual(input);
  });
});

describe('buildJourneyStatusUpdate', () => {
  it('returns input unchanged', () => {
    const input = { id: journeyId, status: 'completed' as const };
    expect(buildJourneyStatusUpdate(input)).toEqual(input);
  });
});
