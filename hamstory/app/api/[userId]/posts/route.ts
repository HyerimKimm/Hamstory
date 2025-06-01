import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    posts: [{ id: 1, title: "첫 번째 포스트" }],
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  return NextResponse.json({
    received: body,
  });
}
