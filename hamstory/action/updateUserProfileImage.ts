"use server";

import { v2 as cloudinary } from "cloudinary";
import { MongoClient } from "mongodb";

import { User } from "@/types/collection";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(file: File): Promise<string> {
  try {
    // File을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cloudinary에 이미지 업로드
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "hamstory/profiles", // 폴더 구조 설정
            transformation: [
              { width: 300, height: 300, crop: "fill", gravity: "face" }, // 프로필 이미지 최적화
              { quality: "auto", fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    return (result as any).secure_url;
  } catch (error) {
    console.error("Cloudinary 업로드 에러:", error);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
}

export async function updateUserProfileImage(
  userId: string,
  imageUrl: string,
): Promise<{
  success: boolean;
  message: string;
  data: string | object | null;
}> {
  const client = new MongoClient(url);

  await client.connect();

  try {
    const db = client.db("hamstory");

    const usersCollection = db.collection<User>("users");

    await usersCollection.updateOne(
      { _id: userId },
      { $set: { profile_image: imageUrl } },
    );

    return {
      success: true,
      message: "프로필 이미지 업데이트 성공",
      data: null,
    };
  } catch (e) {
    return {
      success: false,
      message: "프로필 이미지 업데이트 실패",
      data: null,
    };
  } finally {
    client.close();
  }
}
