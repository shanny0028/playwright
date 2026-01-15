
// monitoring.ts
import { Page, Response, JSHandle } from 'playwright';

export function enableMonitoring(page: Page, attach: (data: any, type: string) => Promise<void>) {
  const out = async (label: string, payload: unknown) => {
    const text = formatPayload(payload);
    console.log(`[monitor] ${label} ${text}`);   // terminal visibility

  };

  // --- Console messages (serialize args!) ---
  page.on('console', async (msg) => {
    try {
      const args = await Promise.all(msg.args().map(toSerializable));
      await out(`console[${msg.type()}]:`, { text: msg.text(), args });
    } catch (e) {
      await out(`console[${msg.type()}]:`, msg.text());
    }
  });

  // --- Page errors with stack ---
  page.on('pageerror', async (err) => {
    await out('pageerror:', { message: err?.message, stack: err?.stack });
  });

  // --- Requests (method/url + headers + body preview) ---
  page.on('request', async (req) => {
    let headers: Record<string, string> | undefined;
    try { headers = await req.allHeaders(); } catch {}
    const postData = req.postData();
    const postPreview = postData ? truncate(postData, 2000) : undefined;

    await out('request:', {
      method: req.method(),
      url: req.url(),
      headers,
      bodyPreview: postPreview
    });
  });

  // --- Responses (status/url + headers + body preview) ---
  page.on('response', async (res) => {
    const ct = res.headers()['content-type'] ?? '';
    let bodyPreview = '<non-text content>';
    try {
      if (ct.includes('application/json')) {
        const text = await res.text();
        bodyPreview = truncate(prettyJson(text), 2000);
      } else if (ct.includes('text/')) {
        const text = await res.text();
        bodyPreview = truncate(text, 2000);
      }
    } catch (e: any) {
      bodyPreview = `<unreadable: ${e?.message}>`;
    }

    await out('response:', {
      status: res.status(),
      url: res.url(),
      headers: res.headers(),
      bodyPreview
    });
  });
}

/* ---------------- helpers ---------------- */

function formatPayload(v: unknown): string {
  try {
    if (typeof v === 'string') return v;
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max) + '…(truncated)' : s;
}

function prettyJson(text: string) {
  try { return JSON.stringify(JSON.parse(text), null, 2); } catch { return text; }
}

async function toSerializable(h: JSHandle) {
  // Try to get a JSON value; fall back to string representation
  try {
    const val = await h.jsonValue();
    // If function or circular, will throw
    return val;
  } catch {
    try {
      const s = await h.evaluate((x) => {
        try { return JSON.stringify(x); } catch { return String(x); }
      });
      return s;
    } catch {
      return '<unserializable>';
    }
  }
}
``
