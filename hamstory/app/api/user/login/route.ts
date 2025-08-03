import { NextRequest, NextResponse } from "next/server";

import { MongoClient } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // email과 password가 제공되었는지 확인
    if (!email || !password) {
      return NextResponse.json(
        { message: "이메일과 비밀번호를 모두 입력해주세요." },
        { status: 400 },
      );
    }

    const url =
      "mongodb+srv://sue05124:hlkim980103@hamstory.bgdlfqq.mongodb.net/?retryWrites=true&w=majority&appName=Hamstory";

    const client = new MongoClient(url);

    await client.connect();

    const db = client.db("hamstory");

    // 사용자 찾기
    const user = await db.collection("users").findOne({
      email: email,
      password: password,
    });

    await client.close();

    if (!user) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    // 로그인 성공 시 사용자 정보 반환 (비밀번호 제외)
    return NextResponse.json({
      message: "로그인 성공",
      user: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("로그인 에러:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
