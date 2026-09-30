// Explicit manual integration test; start/remove actions change billable AWS resources.
const action = process.argv[2] || 'status';
const learnerId = process.env.TEST_LEARNER_ID || 'lightsail-test-student-0001';
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
let endpoint = `/api/godot/config?learnerId=${encodeURIComponent(learnerId)}`;
let method = 'GET';
if (action === 'start') { endpoint = '/api/godot/session'; method = 'POST'; }
else if (action === 'remove') { endpoint = '/api/godot/workspace'; method = 'DELETE'; }
else if (action === 'session') { endpoint = '/api/godot/session'; method = 'POST'; }
else if (action === 'stop') { endpoint = '/api/godot/stop'; method = 'POST'; }
else if (action === 'config') endpoint = `/api/godot/config?learnerId=${encodeURIComponent(learnerId)}`;
else if (action !== 'status') throw new Error('Invalid action');
const response = await fetch(`${origin}${endpoint}`, {
  method,
  headers: { 'content-type': 'application/json' },
  body: method === 'GET' ? undefined : JSON.stringify({ learnerId, confirmed: action === 'remove' }),
  signal: AbortSignal.timeout(240_000),
});
const result = await response.json();
if (action === 'session' && response.ok) {
  console.log(JSON.stringify({ status: response.status, sessionCreated: Boolean(result.url && result.downloadUrl), origin: new URL(result.url).origin }));
} else console.log(JSON.stringify({ status: response.status, ...result }));
if (!response.ok) process.exitCode = 1;
