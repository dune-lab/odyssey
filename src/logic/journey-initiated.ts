import { fn } from '@enxoval/types';
import { Journey } from '../model/journey';
import { JourneyInitiatedInput } from '../model/journey-initiated';

export const buildJourneyInitiated = fn(Journey, JourneyInitiatedInput, (journey) => ({
  journeyId: journey.id,
}));
