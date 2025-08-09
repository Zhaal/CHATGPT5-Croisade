function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
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
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders() };
  if (event.httpMethod !== "GET") return respond(405, { error: "Method Not Allowed" });

  const key = (event.queryStringParameters && event.queryStringParameters.key) || "default";

  try {
    const mod = await import("@netlify/blobs");
    const getStore = mod.getStore || mod.default?.getStore;
    if (!getStore) throw new Error("Netlify Blobs: getStore introuvable.");

    const siteID = process.env.BLOBS_SITE_ID;
    const token  = process.env.BLOBS_TOKEN;
    console.log("loadCampaign env:", !!siteID, !!token); // true true attendu
    if (!siteID || !token) throw new Error("BLOBS_SITE_ID ou BLOBS_TOKEN manquant(s).");

    const store = getStore("campaigns", { siteID, token });
    const data = await store.getJSON(key);

    if (!data) return respond(404, { error: "not found" });
    return {
      statusCode: 200,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("loadCampaign error:", err);
    return respond(500, { error: "load failed", details: String(err?.message || err) });
  }
};
