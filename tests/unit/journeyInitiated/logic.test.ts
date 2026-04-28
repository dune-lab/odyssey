import { describe, it, expect } from '@enxoval/testing';
import { buildJourneyInitiated } from '../../../src/logic/journey-initiated';

const journeyId = '11111111-1111-1111-1111-111111111111';

describe('buildJourneyInitiated', () => {
  it('maps journey.id to journeyId', () => {
    const result = buildJourneyInitiated({
      id: journeyId,
      studentId: '22222222-2222-2222-2222-222222222222',
      currentStep: 'JOURNEY_INITIATED',
      status: 'active',
      createdAt: new Date('2024-01-01'),
    });
    expect(result).toEqual({ journeyId });
  });
});
