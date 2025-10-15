"use server";

import { unstable_cache } from "next/cache";

import { MongoClient } from "mongodb";

import { Blog, User } from "@/types/collection";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

export async function getUserProfile(userId: string) {
  return unstable_cache(
    async function getUserProfile(): Promise<User | null> {
      const client = new MongoClient(url);

      await client.connect();
      console.log("getUserProfile 실행됨");

      try {
        const db = client.db("hamstory");
        // Collection을 User 타입으로 타입 지정
        const collection = db.collection<User>("users");

        const user = await collection.findOne({ _id: userId });

        return user;
      } finally {
        client.close();
      }
    },
    ["user", userId], // 동일한 키는 같은 캐시를 사용
    {
      revalidate: 60 * 5,
      tags: ["users", "profiles"], // 캐시 무효화를 위한 그룹핑
    },
  )();
}

// Blog Collection의 정보 조회
export async function getUserBlog(userId: string) {
  return unstable_cache(
    async function getUserBlog(): Promise<Blog | null> {
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
    },
    ["blog", userId],
    {
      revalidate: 60 * 5,
    },
  )();
}
