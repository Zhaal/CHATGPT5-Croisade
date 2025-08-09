// Function Netlify (CommonJS) — chargement en ligne
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
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders() };
  }
  if (event.httpMethod !== "GET") {
    return respond(405, { error: "Method Not Allowed" });
  }

  const key =
    (event.queryStringParameters && event.queryStringParameters.key) ||
    "default";

  try {
    // Import ESM robuste
    const mod = await import("@netlify/blobs");
    const getStore = mod.getStore || (mod.default && mod.default.getStore);
    if (!getStore) {
      throw new Error(
        "Netlify Blobs: getStore introuvable. Mets à jour @netlify/blobs (ex: ^7) ou garde ce shim."
      );
    }

    const store = getStore("campaigns");

    // Lecture brute (string JSON). Option: await store.get(key, { type: 'json' })
    const data = await store.get(key);

    if (!data) return respond(404, { error: "not found" });

    // On renvoie le JSON tel quel (déjà stringifié côté save)
    return {
      statusCode: 200,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: data,
    };
  } catch (err) {
    console.error("loadCampaign error:", err);
    return respond(500, {
      error: "load failed",
      details: String((err && err.message) || err),
    });
  }
};
