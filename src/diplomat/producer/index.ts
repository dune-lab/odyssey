/**
 * diplomat/producer/index.ts
 *
 * Registra os schemas dos tópicos Kafka que odyssey produz.
 * Chamado no setup do serviço para expor os contratos via GET /topics.
 * Não publica mensagens — apenas insere no registry de @enxoval/messaging.
 *
 * Input:  none
 * Output: void (efeito colateral: registeredTopics[] populado)
 */
import { registerProducer } from '@enxoval/messaging';
import { Event } from '../../model/event';

export function setupProducers(): void {
  registerProducer('journeyInitiated',          { schema: Event, name: 'Event' });
  registerProducer('diagnosticTriggered',       { schema: Event, name: 'Event' });
  registerProducer('diagnosticCompleted',       { schema: Event, name: 'Event' });
  registerProducer('analysisStarted',           { schema: Event, name: 'Event' });
  registerProducer('analysisFinished',          { schema: Event, name: 'Event' });
  registerProducer('curriculumGenerated',       { schema: Event, name: 'Event' });
  registerProducer('contentDispatched',         { schema: Event, name: 'Event' });
  registerProducer('studentEngagementReceived', { schema: Event, name: 'Event' });
  registerProducer('progressMilestoneReached',  { schema: Event, name: 'Event' });
}
