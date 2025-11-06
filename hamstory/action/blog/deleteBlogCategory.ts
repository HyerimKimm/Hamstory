"use server";

import { revalidateTag } from "next/cache";

import { MongoClient } from "mongodb";

import { Category } from "@/types/collection";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

export async function deleteBlogCategory(categoryId: string) {
  if (process.env.NEXT_PUBLIC_IS_MOCK === "true") {
    return new Promise((resolve) => {
      setTimeout(() => {
        revalidateTag("category");
        return { success: true, message: "카테고리 삭제 성공" };
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

        const categoriesCollection = db.collection<Category>("categories");

        const result = await categoriesCollection.deleteOne({
          _id: categoryId,
        });

        if (result.acknowledged) {
          revalidateTag("category");
          return { success: true, message: "카테고리 삭제 성공" };
        } else {
          return { success: false, message: "카테고리 삭제 실패", data: null };
        }
      } catch (e) {
        console.error("Delete category error:", e);
        return { success: false, message: "카테고리 삭제 실패", data: null };
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
}
