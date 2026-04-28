import { describe, it, expect } from '@enxoval/testing';
import { buildEvent } from '../../../src/logic/event';

const journeyId = '11111111-1111-1111-1111-111111111111';
const eventId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

describe('buildEvent', () => {
  it('returns journeyId and eventId from input', () => {
    const result = buildEvent({ journeyId, eventId });
    expect(result).toEqual({ journeyId, eventId });
  });
});
