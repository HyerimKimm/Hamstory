import { NextRequest, NextResponse } from "next/server";

import { MongoClient } from "mongodb";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const url =
    "mongodb+srv://sue05124:hlkim980103@hamstory.bgdlfqq.mongodb.net/?retryWrites=true&w=majority&appName=Hamstory";

  const client = new MongoClient(url);

  await client.connect();
  console.log("Connected successfully to server");

  const db = client.db("hamstory");

  db.collection("users").insertOne({
    nickname: body.nickname,
    email: body.email,
    password: body.password,
  });

  client.close();

  return NextResponse.json({
    message: "성공",
  });
}
