import { get, post } from '@enxoval/http';
import {
  listDlqMessages,
  reprocessDlqOne,
  reprocessDlqAllByTopic,
  dismissDlqMessage,
} from '../../controllers/harkonnen';

export function registerHarkonnenRoutes(): void {
  get('/harkonnen', async () => listDlqMessages({}));
  post('/harkonnen/reprocess', async (body) => reprocessDlqOne(body));
  post('/harkonnen/reprocess-all', async (body) => reprocessDlqAllByTopic(body));
  post('/harkonnen/dismiss', async (body) => dismissDlqMessage(body));
}
