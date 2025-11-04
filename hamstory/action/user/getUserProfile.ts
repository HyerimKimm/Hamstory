"use server";

import { unstable_cache } from "next/cache";

import TAGS from "@/action/config/tags";
import { MongoClient } from "mongodb";

import { User } from "@/types/collection";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

/* 사용자 정보(users collection) 조회 */
export async function getUserProfile(userId: string) {
  return unstable_cache(
    async function getUserProfile(): Promise<User | null> {
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
    },
    TAGS.users.tags(userId), // 동일한 키는 같은 캐시를 사용
    {
      revalidate: TAGS.users.revalidate,
      tags: TAGS.users.revalidateTag, // 캐시 무효화를 위한 그룹핑
    },
  )();
}
