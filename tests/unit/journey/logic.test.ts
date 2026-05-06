/**
 * Unit tests for journey logic functions using itCases.
 * Covers buildJourney, buildJourneyStepUpdate, and buildJourneyStatusUpdate.
 */

import { describe, itCases, expect } from '@enxoval/testing';
import { buildJourney, buildJourneyStepUpdate, buildJourneyStatusUpdate } from '../../../src/logic/journey';
import { JourneyInput, JourneyStepUpdate, JourneyStatusUpdate } from '../../../src/model/journey';

describe('buildJourney', () => {
  itCases('sets initial step to JOURNEY_INITIATED', JourneyInput, (input) => {
    expect(buildJourney(input).currentStep).toBe('JOURNEY_INITIATED');
  });

  itCases('sets initial status to active', JourneyInput, (input) => {
    expect(buildJourney(input).status).toBe('active');
  });

  itCases('carries studentId through', JourneyInput, (input) => {
    expect(buildJourney(input).studentId).toBe(input.studentId);
  });

  itCases('does not generate id', JourneyInput, (input) => {
    expect((buildJourney(input) as Record<string, unknown>).id).toBeUndefined();
  });
});

describe('buildJourneyStepUpdate', () => {
  itCases('returns input unchanged', JourneyStepUpdate, (input) => {
    expect(buildJourneyStepUpdate(input)).toEqual(input);
  });
});

describe('buildJourneyStatusUpdate', () => {
  itCases('returns input unchanged', JourneyStatusUpdate, (input) => {
    expect(buildJourneyStatusUpdate(input)).toEqual(input);
  });
});
