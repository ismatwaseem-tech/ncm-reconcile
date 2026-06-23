// Netlify function: proxies POST requests to ncm.gov.sa/en/early-warning
// Returns the JSON response: { html, paginationHtml, alertCounts }
// Supports pagination via ?page=N query param (fetches all pages if page=all)

export async function handler(event) {
  const params = event.queryStringParameters || {};
  const pageParam = params.page || "1";

  try {
    const NCM_URL = "https://www.ncm.gov.sa/en/early-warning";

    if (pageParam === "all") {
      // Fetch all pages and merge HTML
      let allHtml = "";
      let alertCounts = {};
      for (let p = 1; p <= 5; p++) {
        const r = await fetch(NCM_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: "page=" + p,
        });
        if (!r.ok) break;
        const json = await r.json();
        if (!json.html || json.html.trim() === "" || !json.html.includes("accordion-item")) break;
        allHtml += json.html;
        alertCounts = json.alertCounts || alertCounts;
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ html: allHtml, alertCounts }),
      };
    }

    const r = await fetch(NCM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: "page=" + pageParam,
    });
    const json = await r.json();
    return {
      statusCode: r.status,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(json),
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: e.message }) };
  }
}
