import { test, describe, it, expect, beforeAll, beforeEach, afterAll, afterEach, generate } from '@enxoval/testing';
import { TestDataSource } from './helpers/data-source';

test.mock('../../src/db/data-source', () => ({ AppDataSource: TestDataSource }));
test.mock('@enxoval/auth', () => ({ setupAuth: test.fn() }));
test.mock('@enxoval/messaging', () => ({
  publish: test.fn(),
  connect: test.fn(),
  disconnect: test.fn(),
}));

import { buildApp } from '../../src/app';
import { inject } from '@enxoval/http';
import { publish } from '@enxoval/messaging';
import { AppDataSource } from '../../src/db/data-source';
import { JourneyDbWire } from '../../src/db/wire/journey';
import { JourneyInitiatedDbWire } from '../../src/db/wire/journey-initiated';
import { StartJourneyWireIn } from '../../src/wire/in/journey';

const validBody = generate(StartJourneyWireIn);
const studentId = validBody.studentId;

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

describe('POST /journeys', () => {
  it('returns 201 with journey fields', async () => {
    const res = await inject({ method: 'POST', url: '/journeys', body: validBody });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.id).toBeDefined();
    expect(body.studentId).toBe(studentId);
    expect(body.currentStep).toBe('JOURNEY_INITIATED');
    expect(body.status).toBe('active');
    expect(body.createdAt).toBeDefined();
  });

  it('inserts Journey with correct step and status', async () => {
    await inject({ method: 'POST', url: '/journeys', body: validBody });

    const journeys = await AppDataSource.getRepository(JourneyDbWire).find();
    expect(journeys).toHaveLength(1);
    expect(journeys[0].student_id).toBe(studentId);
    expect(journeys[0].current_step).toBe('JOURNEY_INITIATED');
    expect(journeys[0].status).toBe('active');
  });

  it('inserts JourneyInitiated linked to the Journey', async () => {
    await inject({ method: 'POST', url: '/journeys', body: validBody });

    const journeys = await AppDataSource.getRepository(JourneyDbWire).find();
    const events = await AppDataSource.getRepository(JourneyInitiatedDbWire).find();
    expect(events).toHaveLength(1);
    expect(events[0].journey_id).toBe(journeys[0].id);
  });

  it('calls publish with journeyInitiated topic and correct payload', async () => {
    await inject({ method: 'POST', url: '/journeys', body: validBody });

    expect(publish).toHaveBeenCalledOnce();
    const [topic, payload] = (publish as ReturnType<typeof test.fn>).mock.calls[0];
    expect(topic).toBe('journeyInitiated');
    expect(payload.journeyId).toBeDefined();
    expect(payload.eventId).toBeDefined();
  });

  it('returns 400 on missing studentId', async () => {
    const res = await inject({ method: 'POST', url: '/journeys', body: {} });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 on invalid UUID for studentId', async () => {
    const res = await inject({ method: 'POST', url: '/journeys', body: { studentId: 'not-a-uuid' } });
    expect(res.statusCode).toBe(400);
  });
});
