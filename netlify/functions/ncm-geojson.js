export async function handler() {
  try {
    const r = await fetch("https://meteo.ncm.gov.sa/public/ews/latest.geojson", {
      headers: { Accept: "application/json", "User-Agent": "NCM-Reconcile/1.0" },
    });
    const body = await r.text();
    return { statusCode: r.status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=120" }, body };
  } catch (e) { return { statusCode: 502, body: JSON.stringify({ error: String(e) }) }; }
}
