import { test, describe, it, expect, beforeAll, beforeEach, afterAll, afterEach, generate } from '@enxoval/testing';
import { TestDataSource } from './helpers/data-source';
import { Journey } from '../../src/model/journey';
import { EventRecord } from '../../src/model/event-record';

test.mock('../../src/db/data-source', () => ({ AppDataSource: TestDataSource }));
test.mock('@enxoval/auth', () => ({ setupAuth: test.fn() }));
test.mock(import('@enxoval/messaging'), async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, publish: test.fn(), publishRaw: test.fn(), connect: test.fn(), disconnect: test.fn() };
});

import { buildApp } from '../../src/app';
import { publish } from '@enxoval/messaging';
import { AppDataSource } from '../../src/db/data-source';
import { JourneyDbWire } from '../../src/db/wire/journey';
import { AnalysisFinishedDbWire } from '../../src/db/wire/analysis-finished';
import { CurriculumGeneratedDbWire } from '../../src/db/wire/curriculum-generated';
import { analysisFinished } from '../../src/controllers/analysis-finished';

const journeyId = generate(Journey).id;
const afId = generate(EventRecord).id;

beforeAll(async () => {
  await TestDataSource.initialize();
  buildApp();
});

afterAll(async () => {
  await TestDataSource.destroy();
});

beforeEach(() => {
  test.clearAll();
});

afterEach(async () => {
  await AppDataSource.getRepository(CurriculumGeneratedDbWire).clear();
  await AppDataSource.getRepository(AnalysisFinishedDbWire).clear();
  await AppDataSource.getRepository(JourneyDbWire).clear();
});

async function seed() {
  await AppDataSource.getRepository(JourneyDbWire).save(
    AppDataSource.getRepository(JourneyDbWire).create({
      id: journeyId,
      student_id: '22222222-2222-2222-2222-222222222222',
      current_step: 'ANALYSIS_FINISHED',
      status: 'active',
    }),
  );
  await AppDataSource.getRepository(AnalysisFinishedDbWire).save(
    AppDataSource.getRepository(AnalysisFinishedDbWire).create({ id: afId, journey_id: journeyId }),
  );
}

describe('analysisFinished consumer', () => {
  it('inserts CurriculumGenerated with id = analysisFinished.id', async () => {
    await seed();
    await analysisFinished({ eventId: afId, journeyId });

    const records = await AppDataSource.getRepository(CurriculumGeneratedDbWire).find();
    expect(records).toHaveLength(1);
    expect(records[0].id).toBe(afId);
    expect(records[0].journey_id).toBe(journeyId);
  });

  it('updates journey current_step to CURRICULUM_GENERATED', async () => {
    await seed();
    await analysisFinished({ eventId: afId, journeyId });

    const journey = await AppDataSource.getRepository(JourneyDbWire).findOneByOrFail({ id: journeyId });
    expect(journey.current_step).toBe('CURRICULUM_GENERATED');
  });

  it('publishes curriculumGenerated with correct payload', async () => {
    await seed();
    await analysisFinished({ eventId: afId, journeyId });

    expect(publish).toHaveBeenCalledOnce();
    const [topic, payload] = (publish as ReturnType<typeof test.fn>).mock.calls[0];
    expect(topic).toBe('curriculumGenerated');
    expect(payload.journeyId).toBe(journeyId);
    expect(payload.eventId).toBe(afId);
  });

  it('is idempotent — second call re-publishes without inserting duplicate', async () => {
    await seed();
    await analysisFinished({ eventId: afId, journeyId });
    await analysisFinished({ eventId: afId, journeyId });

    const records = await AppDataSource.getRepository(CurriculumGeneratedDbWire).find();
    expect(records).toHaveLength(1);
    expect(publish).toHaveBeenCalledTimes(2);
  });
});
