// CommonJS + import ESM + CORS + contexte explicite (siteID/token)

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
  if (event.httpMethod !== "POST") return respond(405, { error: "Method Not Allowed" });

  const key = (event.queryStringParameters && event.queryStringParameters.key) || "default";

  try {
    const mod = await import("@netlify/blobs");
    const getStore = mod.getStore || mod.default?.getStore;
    if (!getStore) throw new Error("Netlify Blobs: getStore introuvable.");

    const siteID = process.env.BLOBS_SITE_ID;
    const token  = process.env.BLOBS_TOKEN;
    console.log("saveCampaign env:", !!siteID, !!token); // doit afficher true true
    if (!siteID || !token) throw new Error("BLOBS_SITE_ID ou BLOBS_TOKEN manquant(s).");

    const store = getStore("campaigns", { siteID, token });

    const body =
      event.headers["content-type"]?.includes("application/json")
        ? (event.body || "{}")
        : "{}";
    await store.setJSON(key, JSON.parse(body));
    return respond(200, { success: true, message: "saved" });
  } catch (err) {
    console.error("saveCampaign error:", err);
    return respond(500, { error: "save failed", details: String(err?.message || err) });
  }
};
