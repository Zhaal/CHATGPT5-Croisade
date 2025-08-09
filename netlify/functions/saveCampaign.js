// ⚠️ plus de "require('@netlify/blobs')"
exports.handler = async (event) => {
  // CORS + méthodes
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors() };
  }
  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'Method Not Allowed' });
  }

  const key = (event.queryStringParameters && event.queryStringParameters.key) || 'default';

  try {
    // ✅ ESM via import() dynamique
    const { getStore } = await import('@netlify/blobs');

    const body = event.headers['content-type']?.includes('application/json') ? (event.body || '{}') : '{}';
    const store = getStore('campaigns');
    await store.set(key, body);

    return respond(200, { success: true, message: 'saved' });
  } catch (err) {
    console.error('saveCampaign error:', err);
    return respond(500, { error: 'save failed', details: String(err?.message || err) });
  }
};

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
