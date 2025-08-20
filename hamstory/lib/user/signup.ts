"use server";

import { redirect } from "next/navigation";

import { MongoClient } from "mongodb";

const url =
  "mongodb+srv://sue05124:hlkim980103@hamstory.bgdlfqq.mongodb.net/?retryWrites=true&w=majority&appName=Hamstory";

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
      redirect("/login");
    } else {
      throw new Error("회원가입 실패");
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
