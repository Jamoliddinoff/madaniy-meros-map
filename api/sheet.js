/**
 * Vercel serverless function — Google Apps Script uchun proxy (production).
 * Brauzer same-origin /api/sheet ga so'rov yuboradi, bu funksiya esa server tomonda
 * Apps Script'ga murojaat qiladi (redirect'ni kuzatadi) → CORS muammosi bo'lmaydi.
 *
 * Vercel env: VITE_SHEET_API_URL (yoki SHEET_API_URL) o'rnatilishi kerak.
 */
export default async function handler(req, res) {
  const url = process.env.SHEET_API_URL || process.env.VITE_SHEET_API_URL;
  if (!url) {
    res.status(500).json({ error: "SHEET_API_URL o'rnatilmagan" });
    return;
  }

  try {
    if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      const upstream = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body,
      });
      const text = await upstream.text();
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(text);
      return;
    }

    // GET
    const upstream = await fetch(url);
    const text = await upstream.text();
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
