"use server";

import { revalidateTag } from "next/cache";

import dayjs from "dayjs";
import { MongoClient, ObjectId } from "mongodb";

import { Category } from "@/types/collection";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

export async function addBlogCategory(blogId: string, name: string) {
  const client = new MongoClient(url, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  try {
    await client.connect();

    try {
      const db = client.db("hamstory");

      const categoriesCollection = db.collection<Category>("categories");

      const categoryId = new ObjectId().toString();

      const result = await categoriesCollection.insertOne({
        _id: categoryId,
        blog_id: blogId,
        name: name,
        created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      });

      if (result.acknowledged) {
        revalidateTag("category");
        return { success: true, message: "카테고리 추가 성공" };
      } else {
        return { success: false, message: "카테고리 추가 실패", data: null };
      }
    } catch (e) {
      console.error("Add category error:", e);
      return { success: false, message: "카테고리 추가 실패", data: null };
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return {
      success: false,
      message:
        error instanceof Error && error.message.includes("timeout")
          ? "데이터베이스 연결 시간이 초과되었습니다. 잠시 후 다시 시도해주세요."
          : "데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.",
      data: null,
    };
  }
}
