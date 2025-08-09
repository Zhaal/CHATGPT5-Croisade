exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors() };
  }
  if (event.httpMethod !== 'GET') {
    return respond(405, { error: 'Method Not Allowed' });
  }

  const key = (event.queryStringParameters && event.queryStringParameters.key) || 'default';

  try {
    const { getStore } = await import('@netlify/blobs'); // ✅
    const store = getStore('campaigns');
    const data = await store.get(key);
    if (!data) return respond(404, { error: 'not found' });

    return { statusCode: 200, headers: { ...cors(), 'Content-Type': 'application/json' }, body: data };
  } catch (err) {
    console.error('loadCampaign error:', err);
    return respond(500, { error: 'load failed', details: String(err?.message || err) });
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
