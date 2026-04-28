import { test, describe, it, expect, beforeAll, beforeEach, afterAll, afterEach } from '@enxoval/testing';
import { TestDataSource } from './helpers/data-source';

test.mock('../../src/db/data-source', () => ({ AppDataSource: TestDataSource }));
test.mock('@enxoval/messaging', () => ({
  publish: test.fn(),
  connect: test.fn(),
  disconnect: test.fn(),
}));

import { buildApp } from '../../src/app';
import { inject } from '@enxoval/http';
import { AppDataSource } from '../../src/db/data-source';
import { JourneyDbWire } from '../../src/db/wire/journey';
import { JourneyInitiatedDbWire } from '../../src/db/wire/journey-initiated';

const studentId = '22222222-2222-2222-2222-222222222222';
const journeyId = '11111111-1111-1111-1111-111111111111';
const jiId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

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
  await AppDataSource.getRepository(JourneyInitiatedDbWire).clear();
  await AppDataSource.getRepository(JourneyDbWire).clear();
});

async function seed() {
  await AppDataSource.getRepository(JourneyDbWire).save(
    AppDataSource.getRepository(JourneyDbWire).create({
      id: journeyId,
      student_id: studentId,
      current_step: 'JOURNEY_INITIATED',
      status: 'active',
    }),
  );
  await AppDataSource.getRepository(JourneyInitiatedDbWire).save(
    AppDataSource.getRepository(JourneyInitiatedDbWire).create({ id: jiId, journey_id: journeyId }),
  );
}

describe('GET /journeys', () => {
  it('returns empty array when no journeys', async () => {
    const res = await inject({ method: 'GET', url: '/journeys' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual([]);
  });

  it('returns journey with events array', async () => {
    await seed();

    const res = await inject({ method: 'GET', url: '/journeys' });
    expect(res.statusCode).toBe(200);

    const body = res.json();
    expect(body).toHaveLength(1);
    expect(body[0].id).toBe(journeyId);
    expect(body[0].studentId).toBe(studentId);
    expect(body[0].currentStep).toBe('JOURNEY_INITIATED');
    expect(body[0].status).toBe('active');
    expect(body[0].createdAt).toBeDefined();
    expect(Array.isArray(body[0].events)).toBe(true);
  });

  it('includes JOURNEY_INITIATED event in events list', async () => {
    await seed();

    const res = await inject({ method: 'GET', url: '/journeys' });
    const journey = res.json()[0];

    expect(journey.events).toHaveLength(1);
    expect(journey.events[0].name).toBe('JOURNEY_INITIATED');
    expect(journey.events[0].id).toBe(jiId);
    expect(journey.events[0].createdAt).toBeDefined();
  });

  it('returns journey with empty events when no events exist', async () => {
    await AppDataSource.getRepository(JourneyDbWire).save(
      AppDataSource.getRepository(JourneyDbWire).create({
        id: journeyId,
        student_id: studentId,
        current_step: 'JOURNEY_INITIATED',
        status: 'active',
      }),
    );

    const res = await inject({ method: 'GET', url: '/journeys' });
    const body = res.json();
    expect(body[0].events).toEqual([]);
  });
});
