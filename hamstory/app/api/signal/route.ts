// app/api/signal/route.ts
let messages: any[] = [];

export async function GET() {
  return Response.json(messages);
}

export async function POST(req: Request) {
  const body = await req.json();
  messages.push(body);
  return Response.json({ ok: true });
}
