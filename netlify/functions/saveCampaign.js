import { getStore } from "@netlify/blobs";

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

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders() };
  }
  if (event.httpMethod !== "POST") {
    return respond(405, { error: "Method Not Allowed" });
  }

  const key = (event.queryStringParameters && event.queryStringParameters.key) || "default";

  try {
    const store = getStore("campaigns");
    const body = event.body || "{}";

    // The body is already a JSON string from the fetch, no need to re-parse if it's already an object
    // But since we receive a string, we need to parse it.
    let dataToStore;
    try {
        dataToStore = JSON.parse(body);
    } catch (e) {
        return respond(400, { error: "Bad Request: Invalid JSON body."});
    }

    await store.setJSON(key, dataToStore);
    return respond(200, { success: true, message: "saved" });
  } catch (err) {
    console.error("saveCampaign error:", err);
    return respond(500, { error: "save failed", details: String(err?.message || err) });
  }
};
