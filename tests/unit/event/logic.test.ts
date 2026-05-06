/**
 * Unit tests for event logic functions using itCases.
 * Covers buildEvent.
 */

import { describe, itCases, expect } from '@enxoval/testing';
import { buildEvent } from '../../../src/logic/event';
import { Event } from '../../../src/model/event';

describe('buildEvent', () => {
  itCases('returns journeyId and eventId from input', Event, (input) => {
    expect(buildEvent(input)).toEqual({ journeyId: input.journeyId, eventId: input.eventId });
  });
});
