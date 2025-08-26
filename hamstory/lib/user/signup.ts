"use server";

import { MongoClient } from "mongodb";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

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

    const result = await db.collection("users").insertOne({
      nickname: formData.get("nickname"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (result.acknowledged) {
      return {
        success: true,
        message: "회원가입 성공",
        data: {
          acknowledged: result.acknowledged,
          insertedId: result.insertedId.toString(),
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
