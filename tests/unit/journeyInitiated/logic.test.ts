import { describe, itCases, expect } from '@enxoval/testing';
import { buildJourneyInitiated } from '../../../src/logic/journey-initiated';
import { Journey } from '../../../src/model/journey';

describe('buildJourneyInitiated', () => {
  itCases('maps journey.id to journeyId', Journey, (input) => {
    expect(buildJourneyInitiated(input)).toEqual({ journeyId: input.id });
  });
});
