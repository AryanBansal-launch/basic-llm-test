import { NextRequest } from "next/server";
import { basicAuthError, tickerEventStream } from "@/lib/basicAuth";

export async function GET(req: NextRequest) {
  const error = basicAuthError(req.headers.get("authorization"), "Authorization");
  if (error) {
    return new Response(`Unauthorized: ${error}`, {
      status: 401,
      headers: { "Proxy-Authenticate": 'Basic realm="Streaming test"' },
    });
  }
  return tickerEventStream();
}
