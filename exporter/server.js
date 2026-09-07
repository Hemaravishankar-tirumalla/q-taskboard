const http = require('http');

const PORT = process.env.PORT || 9000;
const EXPECTED_TOKEN = process.env.EXPORTER_INTERNAL_TOKEN;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Tasks';

if (!EXPECTED_TOKEN) {
  console.warn('EXPORTER_INTERNAL_TOKEN is not configured; exporter will reject requests.');
}

const Airtable = require('airtable');
const base = AIRTABLE_API_KEY && AIRTABLE_BASE_ID ? new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID) : null;

function buildRecord(task) {
  const assigneeName = task.assignee?.name || '';
  return {
    'Task ID': task.id,
    'Project ID': task.project_id,
    'Title': task.title,
    'Description': task.description || '',
    'Status': task.status,
    'Assignee': assigneeName,
    'Assignee Email': task.assignee?.email || '',
    'Created By': task.created_by_id || '',
    'Created At': task.created_at || '',
    'Updated At': task.updated_at || '',
    'Position': task.position,
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'method not allowed' });
    return;
  }

  const auth = req.headers.authorization || '';
  if (!EXPECTED_TOKEN || auth !== `Bearer ${EXPECTED_TOKEN}`) {
    sendJson(res, 401, { error: 'unauthorized' });
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const payload = JSON.parse(body || '{}');
      const tasks = Array.isArray(payload.tasks) ? payload.tasks : [];
      if (!base) {
        sendJson(res, 500, { error: 'Airtable credentials are not configured' });
        return;
      }

      const table = base(AIRTABLE_TABLE_NAME);
      const records = tasks.map(buildRecord);
      const created = [];

      for (const record of records) {
        const inserted = await table.create(record);
        created.push(inserted.id);
      }

      sendJson(res, 200, {
        ok: true,
        projectId: payload.projectId || null,
        exported: created.length,
        records: created,
      });
    } catch (error) {
      console.error('export failure', error);
      sendJson(res, 500, {
        error: 'export failed',
        detail: error && error.message ? error.message : String(error),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Airtable exporter listening on port ${PORT}`);
});
