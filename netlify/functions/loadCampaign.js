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
  if (event.httpMethod !== "GET") {
    return respond(405, { error: "Method Not Allowed" });
  }

  const key = (event.queryStringParameters && event.queryStringParameters.key) || "default";

  try {
    const store = getStore("campaigns");
    const data = await store.get(key, { type: "json" });

    if (data === null) {
      return respond(404, { error: "not found" });
    }

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
