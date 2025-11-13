"use server";

import { unstable_cache } from "next/cache";

import TAGS from "@/action/config/tags";
import { MongoClient } from "mongodb";

import { Blog, Category } from "@/types/collection";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

// 로그인한 유저의 Blog Collection의 정보 조회
export async function getUserBlog(userId: string) {
  return unstable_cache(
    async function getUserBlog(): Promise<Blog | null> {
      if (process.env.NEXT_PUBLIC_IS_MOCK === "true") {
        return new Promise((resolve) => {
          setTimeout(() => {
            return resolve({
              _id: "blog1",
              user_id: "user1",
              title: "test",
              description: "test",
              created_at: "2025-01-01 00:00:00",
              updated_at: "2025-01-01 00:00:00",
            });
          }, 1000);
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
            const collection = db.collection<Blog>("blogs");

            const blog = await collection.findOne({ user_id: userId });

            return blog;
          } finally {
            client.close();
          }
        } catch (error) {
          console.error("Error fetching user blog:", error);
          return null;
        }
      }
    },
    TAGS.blogs.tags(userId),
    {
      revalidate: TAGS.blogs.revalidate,
      tags: TAGS.blogs.revalidateTag,
    },
  )();
}

// 블로그 아이디로 블로그 카테고리 조회하기
export async function getBlogCategory(blogId: string) {
  return unstable_cache(
    async function getBlogCategory(): Promise<Category[]> {
      if (process.env.NEXT_PUBLIC_IS_MOCK === "true") {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                _id: "category1",
                blog_id: "blog1",
                name: "일상",
                created_at: "2025-01-01 00:00:00",
                updated_at: "2025-01-01 00:00:00",
                sort_order: 0,
              },
              {
                _id: "category2",
                blog_id: "blog1",
                name: "프로그래밍",
                created_at: "2025-01-01 00:00:00",
                updated_at: "2025-01-01 00:00:00",
                sort_order: 1,
              },
            ]);
          }, 1000);
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
            const collection = db.collection<Category>("categories");

            const categories = await collection
              .find({ blog_id: blogId })
              .toArray();
            categories.sort((a, b) => a.sort_order - b.sort_order);

            return categories;
          } finally {
            client.close();
          }
        } catch (error) {
          console.error("Error fetching blog categories:", error);
          return [];
        }
      }
    },
    TAGS.categories.tags(blogId),
    {
      revalidate: TAGS.categories.revalidate,
      tags: TAGS.categories.revalidateTag, // 캐시 무효화를 위한 그룹핑
    },
  )();
}
