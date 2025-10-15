"use server";

import { revalidateTag } from "next/cache";

import { MongoClient } from "mongodb";

import { User } from "@/types/collection";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

// 닉네임 수정
export async function updateUserNickname(userId: string, nickname: string) {
  if (!userId) {
    return { success: false, message: "유저 정보를 찾을 수 없습니다." };
  }

  if (!nickname || nickname.length < 2 || nickname.length > 10) {
    return {
      success: false,
      message: "닉네임은 2자 이상 10자 이하로 입력해 주세요.",
    };
  }

  const client = new MongoClient(url);
  await client.connect();

  try {
    const db = client.db("hamstory");

    const usersCollection = db.collection<User>("users");

    const result = await usersCollection.updateOne(
      { _id: userId },
      { $set: { nickname } },
    );

    if (result.acknowledged) {
      // 사용자 프로필 캐시 무효화
      revalidateTag("users");
      return { success: true, message: "닉네임 수정에 성공했습니다." };
    } else {
      return { success: false, message: "닉네임 수정에 실패했습니다." };
    }
  } catch (e) {
    console.error(e);
    return { success: false, message: "닉네임 수정에 실패했습니다." };
  } finally {
    await client.close();
  }
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 이메일 수정
export async function updateUserEmail(userId: string, email: string) {
  if (!userId) {
    return { success: false, message: "유저 정보를 찾을 수 없습니다." };
  }

  if (!email || !emailRegex.test(email)) {
    return {
      success: false,
      message: "이메일 형식이 올바르지 않습니다.",
    };
  }

  const client = new MongoClient(url);
  await client.connect();

  try {
    const db = client.db("hamstory");

    const usersCollection = db.collection<User>("users");

    const result = await usersCollection.updateOne(
      { _id: userId },
      { $set: { email } },
    );

    if (result.acknowledged) {
      // 사용자 프로필 캐시 무효화
      revalidateTag("users");
      return { success: true, message: "이메일 수정에 성공했습니다." };
    } else {
      return { success: false, message: "이메일 수정에 실패했습니다." };
    }
  } catch (e) {
    console.error(e);
    return { success: false, message: "이메일 수정에 실패했습니다." };
  } finally {
    await client.close();
  }
}
