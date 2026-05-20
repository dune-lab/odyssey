import { get, html } from '@enxoval/http';
import { renderApiDocs } from '@enxoval/http';
import { setupAuth } from '@enxoval/auth';
import { setupRoutes } from './diplomat/http-server/index';
import { checkHealth } from './health/index';
import { openApiSpec } from './docs/openapi';

export function buildApp(): void {
  setupAuth({ exclude: ['/health', '/docs', '/routes', '/journeys/:journeyId/stream'] });
  get('/health', () => checkHealth(), { in: null, out: null });
  html('/docs', async () => renderApiDocs(openApiSpec), { in: null, out: null });
  setupRoutes();
}
