"use server";

import { unstable_cache } from "next/cache";

import TAGS from "@/action/config/tags";
import { MongoClient } from "mongodb";

import { Post } from "@/types/collection";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

// 특정 유저의 게시글 조회
export async function getPosts(userId: string) {
  return unstable_cache(
    async function getPosts() {
      const client = new MongoClient(url);

      await client.connect();

      try {
        const db = client.db("hamstory");
        const collection = db.collection<Post>("posts");

        const posts = await collection.find({ user_id: userId }).toArray();

        return posts;
      } catch (error) {
        console.error("Error fetching posts:", error);
        return null;
      } finally {
        client.close();
      }
    },
    TAGS.posts.tags(userId),
    {
      revalidate: TAGS.posts.revalidate,
      tags: TAGS.posts.revalidateTag,
    },
  );
}
