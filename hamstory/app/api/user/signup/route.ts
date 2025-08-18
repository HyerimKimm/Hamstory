import { NextRequest, NextResponse } from "next/server";

import { MongoClient } from "mongodb";

export async function POST(req: NextRequest) {
  const response: {
    success: boolean;
    message: string;
    data: string | object | null;
  } = {
    success: false,
    message: "",
    data: null,
  };

  const body = await req.json();

  const url =
    "mongodb+srv://sue05124:hlkim980103@hamstory.bgdlfqq.mongodb.net/?retryWrites=true&w=majority&appName=Hamstory";

  const client = new MongoClient(url);

  await client.connect();

  const db = client.db("hamstory");

  try {
    const result = await db.collection("users").insertOne({
      nickname: body.nickname,
      email: body.email,
      password: body.password,
    });

    response.success = true;
    response.message = "성공";
    response.data = {
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
    };
  } catch (e) {
    console.error(e);
    response.success = false;
    response.message = "실패";
    response.data = null;
  } finally {
    client.close();
  }

  return NextResponse.json(response);
}
