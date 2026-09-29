export async function GET() {
  const id = Math.floor(Math.random() * 100) + 1;
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

  if (!res.ok) {
    return Response.json(
      { error: `JSONPlaceholder error (${res.status})` },
      { status: 502 }
    );
  }

  return Response.json(await res.json());
}
