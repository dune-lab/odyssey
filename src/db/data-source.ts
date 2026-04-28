import 'reflect-metadata';
import { join } from 'node:path';
import { createDataSource } from '@enxoval/db';
import { JourneySchema } from './wire/journey';
import { JourneyInitiatedSchema } from './wire/journey-initiated';
import { DiagnosticTriggeredSchema } from './wire/diagnostic-triggered';
import { DiagnosticCompletedSchema } from './wire/diagnostic-completed';
import { AnalysisStartedSchema } from './wire/analysis-started';
import { AnalysisFinishedSchema } from './wire/analysis-finished';
import { CurriculumGeneratedSchema } from './wire/curriculum-generated';
import { ContentDispatchedSchema } from './wire/content-dispatched';
import { StudentEngagementReceivedSchema } from './wire/student-engagement-received';
import { ProgressMilestoneReachedSchema } from './wire/progress-milestone-reached';
import { JourneyCompletedSchema } from './wire/journey-completed';

export const AppDataSource = createDataSource({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'odyssey',
  entities: [
    JourneySchema,
    JourneyInitiatedSchema,
    DiagnosticTriggeredSchema,
    DiagnosticCompletedSchema,
    AnalysisStartedSchema,
    AnalysisFinishedSchema,
    CurriculumGeneratedSchema,
    ContentDispatchedSchema,
    StudentEngagementReceivedSchema,
    ProgressMilestoneReachedSchema,
    JourneyCompletedSchema,
  ],
  migrationsDir: join(__dirname, 'migrations'),
});
