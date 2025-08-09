const { getStore } = require('@netlify/blobs');

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
function respond(statusCode, json) {
  return { statusCode, headers: { ...cors(), 'Content-Type': 'application/json' }, body: JSON.stringify(json) };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors() };
  if (event.httpMethod !== 'POST') return respond(405, { error: 'Method Not Allowed' });

  const key = (event.queryStringParameters && event.queryStringParameters.key) || 'default';

  try {
    const store = getStore('campaigns');          // pas de token requis côté Function
    const body = event.headers['content-type']?.includes('application/json') ? (event.body || '{}') : '{}';
    await store.set(key, body);                    // ou await store.setJSON(key, JSON.parse(body))
    return respond(200, { success: true, message: 'saved' });
  } catch (err) {
    console.error('saveCampaign error:', err);
    return respond(500, { error: 'save failed', details: String(err?.message || err) });
  }
};
