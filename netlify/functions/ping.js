exports.handler = async (_event, context) => {
  let blobsAvailable = false;
  try {
    if (context?.netlify?.blobs?.getStore) {
      const store = await context.netlify.blobs.getStore("campaigns");
      if (store?.list) {
        await store.list({ limit: 1 });
      }
      blobsAvailable = true;
    }
  } catch (err) {
    blobsAvailable = false;
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({
      ok: true,
      node: process.version,
      env: {
        BLOBS_SITE_ID: !!process.env.BLOBS_SITE_ID,
        BLOBS_TOKEN:  !!process.env.BLOBS_TOKEN
      },
      blobsAvailable
    })
  };
};
