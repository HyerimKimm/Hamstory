"use server";

import { MongoClient, ObjectId } from "mongodb";

import { hashUserPassword } from "../lib/user/hash";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

// 사용자 인터페이스 정의 - _id를 string으로 명시
interface User {
  _id: string;
  nickname: string;
  email: string;
  password: string;
}

export default async function signup(
  prevState: {
    success: boolean;
    message: string;
    data: string | object | null;
  },
  formData: FormData,
) {
  const client = new MongoClient(url);

  await client.connect();

  try {
    const db = client.db("hamstory");

    // Collection을 User 타입으로 타입 지정
    const usersCollection = db.collection<User>("users");

    // 문자열 ID 생성 (ObjectId를 문자열로 변환)
    const userId = new ObjectId().toString();

    const result = await usersCollection.insertOne({
      _id: userId, // 이제 타입 에러 없이 string으로 사용 가능
      nickname: formData.get("nickname") as string,
      email: formData.get("email") as string,
      password: hashUserPassword(formData.get("password") as string),
    });

    if (result.acknowledged) {
      return {
        success: true,
        message: "회원가입 성공",
        data: {
          acknowledged: result.acknowledged,
          insertedId: userId, // 이미 문자열
        },
      };
    } else {
      return {
        success: false,
        message: "회원가입 실패",
        data: null,
      };
    }
  } catch (e) {
    return {
      success: false,
      message: "회원가입 실패",
      data: null,
    };
  } finally {
    client.close();
  }
}
