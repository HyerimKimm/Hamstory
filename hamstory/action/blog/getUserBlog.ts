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

          return categories;
        } finally {
          client.close();
        }
      } catch (error) {
        console.error("Error fetching blog categories:", error);
        return [];
      }
    },
    TAGS.categories.tags(blogId),
    {
      revalidate: TAGS.categories.revalidate,
      tags: TAGS.categories.revalidateTag, // 캐시 무효화를 위한 그룹핑
    },
  )();
}
