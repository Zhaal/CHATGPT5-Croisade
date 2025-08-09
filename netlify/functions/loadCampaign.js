const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const key = event.queryStringParameters && event.queryStringParameters.key ? event.queryStringParameters.key : 'default';

  try {
    const store = getStore('campaigns');
    const data = await store.get(key);
    if (!data) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Save not found' }) };
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load data from persistent store', details: err.message })
    };
  }
};
