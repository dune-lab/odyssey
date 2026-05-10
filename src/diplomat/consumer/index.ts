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
  consume('journeyInitiated', handle(journeyStarted));
  consume('diagnosticTriggered', handle(diagnosticTriggered));
  consume('diagnosticCompleted', handle(diagnosticCompleted));
  consume('analysisStarted', handle(analysisStarted));
  consume('analysisFinished', handle(analysisFinished));
  consume('curriculumGenerated', handle(curriculumGenerated));
  consume('contentDispatched', handle(contentDispatched));
  consume('studentEngagementReceived', handle(studentEngagementReceived));
  consume('progressMilestoneReached', handle(progressMilestoneReached));
}
