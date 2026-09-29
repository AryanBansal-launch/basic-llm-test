import { NextRequest } from "next/server";

const USER = process.env.BASIC_AUTH_USER || "launch";
const PASSWORD = process.env.BASIC_AUTH_PASSWORD || "streaming";
const EVENTS = 10;
const INTERVAL_MS = 500;

function isAuthorized(req: NextRequest) {
  const [scheme, encoded] = (req.headers.get("authorization") ?? "").split(" ");
  if (scheme !== "Basic" || !encoded) return false;
  const decoded = atob(encoded);
  const sep = decoded.indexOf(":");
  return decoded.slice(0, sep) === USER && decoded.slice(sep + 1) === PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Streaming test"' },
    });
  }

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
