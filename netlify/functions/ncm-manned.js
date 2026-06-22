export async function handler(event) {
  let payload;
  try { payload = event.body ? JSON.parse(event.body) : null; } catch { payload = null; }
  if (!payload || !payload.from_date) {
    const fmt = (d) => d.toISOString().slice(0, 10);
    const from = new Date(), to = new Date(); to.setDate(to.getDate() + 2);
    payload = { from_date: fmt(from), to_date: fmt(to), lang: "en" };
  }
  try {
    const r = await fetch("https://ncm.gov.sa/manned-alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": "NCM-Reconcile/1.0" },
      body: JSON.stringify(payload),
    });
    const body = await r.text();
    return { statusCode: r.status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=120" }, body };
  } catch (e) { return { statusCode: 502, body: JSON.stringify({ error: String(e) }) }; }
}
