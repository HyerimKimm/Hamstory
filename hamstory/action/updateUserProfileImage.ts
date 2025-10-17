"use server";

import { revalidateTag } from "next/cache";

import { v2 as cloudinary } from "cloudinary";
import { MongoClient } from "mongodb";

import { User } from "@/types/collection";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

// 프로필이미지를 Cloudinary에 업로드
export async function uploadImageToCloudinary(file: File): Promise<{
  success: boolean;
  message: string;
  data: {
    publicId: string;
    url: string;
  } | null;
}> {
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

    return {
      success: true,
      message: "프로필 이미지 업로드 성공",
      data: {
        publicId: (result as any).public_id,
        url: (result as any).secure_url,
      },
    };
  } catch (error) {
    console.error("Cloudinary 업로드 에러:", error);
    return {
      success: false,
      message: "프로필 이미지 업로드 실패",
      data: null,
    };
  }
}

// 프로필이미지 URL을 User Collection에 업데이트
export async function updateUserProfileImage(
  userId: string,
  publicId: string,
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
      {
        $set: {
          profile_image_url: imageUrl,
          profile_image_public_id: publicId,
        },
      },
    );

    // 사용자 프로필 캐시 무효화
    revalidateTag("user");

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

// 프로필이미지를 Cloudinary에서 삭제
export async function deleteCloudinaryImage(public_id: string): Promise<{
  success: boolean;
  message: string;
  data: null;
}> {
  try {
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      return {
        success: true,
        message: "프로필 이미지 삭제 성공",
        data: null,
      };
    } else {
      throw new Error("프로필 이미지 삭제 실패");
    }
  } catch (e) {
    return {
      success: false,
      message: "프로필 이미지 삭제 실패",
      data: null,
    };
  }
}
