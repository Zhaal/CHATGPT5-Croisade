function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function respond(statusCode, json) {
  return {
    statusCode,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(json),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders() };
  }
  if (event.httpMethod !== "GET") {
    return respond(405, { error: "Method Not Allowed" });
  }

  try {
    const mod = await import("@netlify/blobs");
    const getStore = mod.getStore || mod.default?.getStore;
    if (!getStore) {
      throw new Error("Netlify Blobs: getStore could not be imported.");
    }

    const siteID = process.env.BLOBS_SITE_ID;
    const token = process.env.BLOBS_TOKEN;
    if (!siteID || !token) {
      throw new Error("Missing Netlify Blobs environment variables.");
    }

    const store = getStore({ name: "campaigns", siteID, token });
    const { blobs } = await store.list();

    const keys = blobs.map(blob => blob.key);

    return respond(200, { keys });
  } catch (err) {
    console.error("listCampaigns error:", err);
    return respond(500, { error: "Failed to list campaigns", details: String(err?.message || err) });
  }
};
