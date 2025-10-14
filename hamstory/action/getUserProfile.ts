"use server";

import { MongoClient } from "mongodb";

import { Blog, User } from "@/types/collection";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

// 사용자 인터페이스 정의 - _id를 string으로 명시
export default async function getUserProfile(
  userId: string,
): Promise<User | null> {
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

export async function getUserBlog(userId: string): Promise<Blog | null> {
  const client = new MongoClient(url);

  await client.connect();

  try {
    const db = client.db("hamstory");
    const collection = db.collection<Blog>("blogs");

    const blog = await collection.findOne({ user_id: userId });

    return blog;
  } catch (error) {
    console.error("Error fetching user blog:", error);
    return null;
  } finally {
    client.close();
  }
}
