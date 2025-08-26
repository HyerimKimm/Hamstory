"use server";

import { MongoClient } from "mongodb";

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
    };
  }

  const client = new MongoClient(url);

  await client.connect();

  try {
    const db = client.db("hamstory");
    const collection = db.collection("users");

    /* Todo : 입력받은 이메일, 비밀번호로 유저 정보 조회 */
    const user = await collection.findOne({ email });

    if (!user) {
      return {
        success: false,
        message: "존재하지 않는 이메일입니다.",
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      };
    }

    return {
      success: true,
      message: "로그인에 성공했습니다.",
      data: user,
    };
  } finally {
    client.close();
  }
}
