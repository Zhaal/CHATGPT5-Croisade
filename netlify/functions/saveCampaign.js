const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const key = event.queryStringParameters && event.queryStringParameters.key ? event.queryStringParameters.key : 'default';

  try {
    const store = getStore('campaigns');
    await store.set(key, event.body || '{}');
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Campaign saved to persistent store' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save data to persistent store', details: err.message })
    };
  }
};
