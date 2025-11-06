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
      if (process.env.NEXT_PUBLIC_IS_MOCK === "true") {
        return new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                _id: "user1",
                nickname: "test",
                email: "test@test.com",
                password: "test",
                created_at: "2025-01-01 00:00:00",
                updated_at: "2025-01-01 00:00:00",
                profile_image_public_id: "",
                profile_image_url: "",
                blog_id: "blog1",
              } as User),
            1000,
          );
        });
      } else {
        const client = new MongoClient(url, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 10000,
        });

        try {
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
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // 연결 실패 시 null 반환 (에러를 throw하지 않음)
          return null;
        }
      }
    },
    TAGS.users.tags(userId), // 동일한 키는 같은 캐시를 사용
    {
      revalidate: TAGS.users.revalidate,
      tags: TAGS.users.revalidateTag, // 캐시 무효화를 위한 그룹핑
    },
  )();
}
