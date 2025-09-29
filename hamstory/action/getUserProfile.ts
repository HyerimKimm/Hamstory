"use server";

import { MongoClient } from "mongodb";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

// 사용자 인터페이스 정의 - _id를 string으로 명시
interface User {
  _id: string;
  nickname: string;
  email: string;
  password: string;
  profile_image: string;
}

export default async function getUserProfile(userId: string) {
  const client = new MongoClient(url);

  await client.connect();

  try {
    const db = client.db("hamstory");
    // Collection을 User 타입으로 타입 지정
    const collection = db.collection<User>("users");

    const user = await collection.findOne({ _id: userId });

    return user;
  } finally {
    client.close();
  }
}
