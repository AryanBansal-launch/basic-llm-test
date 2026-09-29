import { NextRequest } from "next/server";
import { basicAuthError, tickerEventStream } from "@/lib/basicAuth";

// Curl-only check: browsers reject a 407 that doesn't come from a configured proxy.
export async function GET(req: NextRequest) {
  const error = basicAuthError(req.headers.get("proxy-authorization"), "Proxy-Authorization");
  if (error) {
    return new Response(`Proxy auth failed: ${error}`, {
      status: 407,
      headers: { "Proxy-Authenticate": 'Basic realm="Proxy streaming test"' },
    });
  }
  return tickerEventStream();
}
