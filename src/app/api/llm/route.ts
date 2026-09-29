import { NextRequest } from "next/server";
import { streamGenerateContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  if (!question || typeof question !== "string") {
    return new Response(JSON.stringify({ error: "Missing question" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let geminiStream: ReadableStream<Uint8Array>;
  try {
    geminiStream = await streamGenerateContent(question);
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Pass Gemini's Server-Sent Events straight through untouched:
  // each event is "data: {json chunk}\n\n". The client parses it.
  return new Response(geminiStream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
