export default async function handler(request, context) {
    const url = new URL(request.url);
  
    if (url.pathname === "/edge-sized") {
      const body = JSON.stringify({ from: "edge", at: Date.now() });
      return new Response(body, {
        headers: {
          "content-type": "application/json",
          "content-length": String(new TextEncoder().encode(body).length),
        },
      });
    }
  
    return fetch(request);
  }
  