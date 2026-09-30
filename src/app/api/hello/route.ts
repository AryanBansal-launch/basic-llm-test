export async function GET() {
  return new Response("Hello, world!", {
    headers: { "Proxy-Authenticate": "sample" },
  });
}
