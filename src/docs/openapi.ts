import { JOURNEY_STEPS, JOURNEY_STATUSES } from '../model/journey';

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Odyssey API',
    version: '1.0.0',
    description: 'Learning journey state machine service.',
  },
  servers: [{ url: 'http://localhost:3001', description: 'Local' }],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        operationId: 'getHealth',
        tags: ['System'],
        responses: {
          '200': {
            description: 'Service health status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', enum: ['ok', 'degraded'] },
                    dependencies: {
                      type: 'object',
                      properties: {
                        database: { type: 'boolean' },
                        kafka: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/journeys': {
      post: {
        summary: 'Start a new journey for a student',
        operationId: 'startJourney',
        tags: ['Journeys'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['studentId'],
                properties: {
                  studentId: { type: 'string', format: 'uuid' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Journey created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    studentId: { type: 'string', format: 'uuid' },
                    currentStep: { type: 'string', enum: [...JOURNEY_STEPS] },
                    status: { type: 'string', enum: [...JOURNEY_STATUSES] },
                    createdAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        summary: 'List all journeys with their events',
        operationId: 'listJourneys',
        tags: ['Journeys'],
        responses: {
          '200': {
            description: 'Journeys with events',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      studentId: { type: 'string', format: 'uuid' },
                      currentStep: { type: 'string', enum: [...JOURNEY_STEPS] },
                      status: { type: 'string', enum: [...JOURNEY_STATUSES] },
                      createdAt: { type: 'string', format: 'date-time' },
                      events: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            name: { type: 'string', enum: [...JOURNEY_STEPS] },
                            id: { type: 'string', format: 'uuid' },
                            createdAt: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/journeys/republish': {
      post: {
        summary: 'Republish stuck journeys',
        operationId: 'republishStuckJourneys',
        tags: ['Journeys'],
        responses: {
          '201': {
            description: 'Number of journeys reactivated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { republished: { type: 'integer' } },
                },
              },
            },
          },
        },
      },
    },
  },
};
