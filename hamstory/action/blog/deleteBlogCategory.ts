"use server";

import { revalidateTag } from "next/cache";

import { MongoClient } from "mongodb";

import { Category } from "@/types/collection";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

export async function deleteBlogCategory(categoryId: string) {
  const client = new MongoClient(url);

  await client.connect();

  try {
    const db = client.db("hamstory");

    const categoriesCollection = db.collection<Category>("categories");

    const result = await categoriesCollection.deleteOne({ _id: categoryId });

    if (result.acknowledged) {
      revalidateTag("category");
      return { success: true, message: "카테고리 삭제 성공" };
    } else {
      return { success: false, message: "카테고리 삭제 실패", data: null };
    }
  } catch (e) {
    return { success: false, message: "카테고리 삭제 실패", data: null };
  } finally {
    await client.close();
  }
}
