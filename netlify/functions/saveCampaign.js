// Function Netlify (CommonJS) — sauvegarde en ligne
// Utilise Netlify Blobs via import() dynamique + shim d'export

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
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders() };
  }
  if (event.httpMethod !== "POST") {
    return respond(405, { error: "Method Not Allowed" });
  }

  const key =
    (event.queryStringParameters && event.queryStringParameters.key) ||
    "default";

  try {
    // Import ESM robuste quelle que soit la forme d’export
    const mod = await import("@netlify/blobs");
    const getStore = mod.getStore || (mod.default && mod.default.getStore);
    if (!getStore) {
      throw new Error(
        "Netlify Blobs: getStore introuvable. Mets à jour @netlify/blobs (ex: ^7) ou garde ce shim."
      );
    }

    const store = getStore("campaigns");

    // On accepte uniquement du JSON (comme ton front)
    const body =
      event.headers["content-type"] &&
      event.headers["content-type"].includes("application/json")
        ? event.body || "{}"
        : "{}";

    // Écriture brute (string JSON). Option: store.setJSON(key, JSON.parse(body))
    await store.set(key, body);

    return respond(200, { success: true, message: "saved" });
  } catch (err) {
    console.error("saveCampaign error:", err);
    return respond(500, {
      error: "save failed",
      details: String((err && err.message) || err),
    });
  }
};
