const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const key = event.queryStringParameters && event.queryStringParameters.key ? event.queryStringParameters.key : 'default';
  const filePath = path.resolve(__dirname, '../data', `${key}.json`);

  try {
    if (!fs.existsSync(filePath)) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Save not found' }) };
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load data', details: err.message })
    };
  }
};
