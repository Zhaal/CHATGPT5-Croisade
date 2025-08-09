const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const key = event.queryStringParameters && event.queryStringParameters.key ? event.queryStringParameters.key : 'default';
  const dataDir = path.resolve(__dirname, '../data');
  const filePath = path.join(dataDir, `${key}.json`);

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(filePath, event.body || '{}', 'utf8');
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save data', details: err.message })
    };
  }
};
