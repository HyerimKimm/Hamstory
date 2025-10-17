"use server";

import { MongoClient } from "mongodb";

import { createAuthSession } from "../../lib/user/auth";
import { verifyPassword } from "../../lib/user/hash";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

export default async function login(
  prevState: {
    success: boolean;
    message: string;
    data: string | object | null;
  },
  formData: FormData,
) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      success: false,
      message: "이메일과 비밀번호를 모두 입력해주세요.",
      data: null,
    };
  }

  const client = new MongoClient(url);

  await client.connect();

  try {
    const db = client.db("hamstory");
    const collection = db.collection("users");

    /* 입력받은 이메일, 비밀번호로 유저 정보 조회 */
    const user = await collection.findOne({ email });

    if (!user) {
      return {
        success: false,
        message: "존재하지 않는 이메일입니다.",
        data: null,
      };
    }

    /* 해시된 비밀번호 검증 */
    const isPasswordValid = verifyPassword(user.password, password as string);

    if (!isPasswordValid) {
      return {
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
        data: null,
      };
    }

    /* 클라이언트로 전달할 사용자 정보 (비밀번호 제외) */
    const userForClient = {
      _id: user._id,
      nickname: user.nickname,
      email: user.email,
      // password는 클라이언트로 전달하지 않음
    };

    await createAuthSession(user._id as any); // 로그인 성공했으니까 클라이언트 요청 시 헤더에 세션 쿠키 추가

    return {
      success: true,
      message: "로그인에 성공했습니다.",
      data: userForClient,
    };
  } finally {
    client.close();
  }
}
