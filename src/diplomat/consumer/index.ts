import { consume } from '@enxoval/messaging';
import { asyncFn } from '@enxoval/types';
import { EventWireIn } from '../../wire/in/event';
import { toModel } from '../../adapters/event';
import { journeyStarted } from '../../controllers/journey-initiated';
import { diagnosticTriggered } from '../../controllers/diagnostic-triggered';
import { diagnosticCompleted } from '../../controllers/diagnostic-completed';
import { analysisStarted } from '../../controllers/analysis-started';
import { analysisFinished } from '../../controllers/analysis-finished';
import { curriculumGenerated } from '../../controllers/curriculum-generated';
import { contentDispatched } from '../../controllers/content-dispatched';
import { studentEngagementReceived } from '../../controllers/student-engagement-received';
import { progressMilestoneReached } from '../../controllers/progress-milestone-reached';

const handle = (controller: (raw: unknown) => Promise<void>) =>
  asyncFn(EventWireIn, async (wire) => controller(toModel(wire)));

export function setupConsumers(): void {
  consume('journeyInitiated',          handle(journeyStarted),           { schema: EventWireIn, name: 'EventWireIn' });
  consume('diagnosticTriggered',       handle(diagnosticTriggered),      { schema: EventWireIn, name: 'EventWireIn' });
  consume('diagnosticCompleted',       handle(diagnosticCompleted),      { schema: EventWireIn, name: 'EventWireIn' });
  consume('analysisStarted',           handle(analysisStarted),          { schema: EventWireIn, name: 'EventWireIn' });
  consume('analysisFinished',          handle(analysisFinished),         { schema: EventWireIn, name: 'EventWireIn' });
  consume('curriculumGenerated',       handle(curriculumGenerated),      { schema: EventWireIn, name: 'EventWireIn' });
  consume('contentDispatched',         handle(contentDispatched),        { schema: EventWireIn, name: 'EventWireIn' });
  consume('studentEngagementReceived', handle(studentEngagementReceived),{ schema: EventWireIn, name: 'EventWireIn' });
  consume('progressMilestoneReached',  handle(progressMilestoneReached), { schema: EventWireIn, name: 'EventWireIn' });
}
