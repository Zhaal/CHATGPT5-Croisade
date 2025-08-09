exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type':'application/json' },
  body: JSON.stringify({
    ok: true,
    node: process.version,
    env: {
      BLOBS_SITE_ID: !!process.env.BLOBS_SITE_ID,
      BLOBS_TOKEN:  !!process.env.BLOBS_TOKEN
    }
  })
});
