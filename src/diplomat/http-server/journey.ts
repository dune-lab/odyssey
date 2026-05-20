import { fn, asyncFn, createSchema, field, NotFoundError } from '@enxoval/types';
import { post, getWith } from '@enxoval/http';
import { StartJourneyWireIn } from '../../wire/in/journey';
import { JourneyWireOut } from '../../wire/out/journey';
import { Journey } from '../../model/journey';
import { startJourney } from '../../controllers/journey';
import * as journeyDb from '../../db/journey';
import * as journeyInitiatedDb from '../../db/journey-initiated';
import * as diagnosticTriggeredDb from '../../db/diagnostic-triggered';
import * as diagnosticCompletedDb from '../../db/diagnostic-completed';
import * as analysisStartedDb from '../../db/analysis-started';
import * as analysisFinishedDb from '../../db/analysis-finished';
import * as curriculumGeneratedDb from '../../db/curriculum-generated';
import * as contentDispatchedDb from '../../db/content-dispatched';
import * as studentEngagementReceivedDb from '../../db/student-engagement-received';
import * as progressMilestoneReachedDb from '../../db/progress-milestone-reached';
import * as journeyCompletedDb from '../../db/journey-completed';

const EVENT_TABLES = [
  ['JOURNEY_INITIATED', journeyInitiatedDb],
  ['DIAGNOSTIC_TRIGGERED', diagnosticTriggeredDb],
  ['DIAGNOSTIC_COMPLETED', diagnosticCompletedDb],
  ['ANALYSIS_STARTED', analysisStartedDb],
  ['ANALYSIS_FINISHED', analysisFinishedDb],
  ['CURRICULUM_GENERATED', curriculumGeneratedDb],
  ['CONTENT_DISPATCHED', contentDispatchedDb],
  ['STUDENT_ENGAGEMENT_RECEIVED', studentEngagementReceivedDb],
  ['PROGRESS_MILESTONE_REACHED', progressMilestoneReachedDb],
  ['JOURNEY_COMPLETED', journeyCompletedDb],
] as const;

const toWireOut = fn(Journey, JourneyWireOut, (j) => ({
  id: j.id,
  studentId: j.studentId,
  currentStep: j.currentStep,
  status: j.status,
  createdAt: j.createdAt.toISOString(),
}));

const JourneyEventOut = createSchema({
  name: field.string(),
  id: field.string(),
  createdAt: field.string(),
});

const FetchEventsInput = createSchema({ journeyId: field.uuid() });

const fetchEvents = asyncFn(
  FetchEventsInput,
  field.array(JourneyEventOut),
  async ({ journeyId }) => {
    const results = await Promise.all(EVENT_TABLES.map(([, db]) => db.findAll()));
    const events: Array<{ name: string; id: string; createdAt: string }> = [];
    for (let i = 0; i < EVENT_TABLES.length; i++) {
      for (const event of results[i]) {
        if (event.journeyId === journeyId) {
          events.push({
            name: EVENT_TABLES[i][0],
            id: event.id,
            createdAt: event.createdAt.toISOString(),
          });
        }
      }
    }
    return events.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },
);

export function registerJourneyRoutes(): void {
  post('/journeys', async (body) => {
    const input = StartJourneyWireIn.parse(body);
    const journey = await startJourney(input);
    return { ...toWireOut(journey), events: [] };
  }, { in: { schema: StartJourneyWireIn, name: 'StartJourneyWireIn' }, out: { schema: JourneyWireOut, name: 'JourneyWireOut' } });

  getWith<{ studentId: string }>('/journeys/by-student/:studentId', async ({ studentId }) => {
    const journey = await journeyDb.findByStudentId(studentId);
    if (!journey) throw new NotFoundError(`Journey for student ${studentId} not found`);
    const events = await fetchEvents({ journeyId: journey.id });
    return { ...toWireOut(journey), events };
  }, { in: null, out: { schema: JourneyWireOut, name: 'JourneyWireOut' } });
}
