const USER = process.env.BASIC_AUTH_USER || "launch";
const PASSWORD = process.env.BASIC_AUTH_PASSWORD || "streaming";
const EVENTS = 10;
const INTERVAL_MS = 500;

// Returns why auth failed (never echoes secrets), or null when authorized.
export function basicAuthError(header: string | null, headerName: string) {
  if (!header) return `no ${headerName} header received`;
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return `${headerName} header is not Basic`;
  const decoded = atob(encoded);
  const sep = decoded.indexOf(":");
  if (decoded.slice(0, sep) !== USER || decoded.slice(sep + 1) !== PASSWORD) {
    return "wrong username or password";
  }
  return null;
}

export function tickerEventStream() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (let n = 1; n <= EVENTS; n++) {
        const event = { n, of: EVENTS, user: USER, serverTime: new Date().toISOString() };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        if (n < EVENTS) await new Promise((r) => setTimeout(r, INTERVAL_MS));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
