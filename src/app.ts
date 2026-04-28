import { get, html } from '@enxoval/http';
import { renderApiDocs } from '@enxoval/http';
import { setupAuth } from '@enxoval/auth';
import { setupRoutes } from './diplomat/http-server/index';
import { checkHealth } from './health/index';
import { openApiSpec } from './docs/openapi';

export function buildApp(): void {
  setupAuth({ exclude: ['/health', '/docs'] });
  get('/health', () => checkHealth());
  html('/docs', async () => renderApiDocs(openApiSpec));
  setupRoutes();
}
