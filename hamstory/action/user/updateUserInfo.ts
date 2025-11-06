"use server";

import { revalidateTag } from "next/cache";

import { MongoClient } from "mongodb";

import { User } from "@/types/collection";
import { ServerResponseType } from "@/types/serverResponse";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

// 닉네임 수정
export async function updateUserNickname(
  userId: string,
  nickname: string,
): ServerResponseType<null> {
  if (!userId) {
    return {
      success: false,
      message: "유저 정보를 찾을 수 없습니다.",
      data: null,
    };
  }

  if (!nickname || nickname.length < 2 || nickname.length > 10) {
    return {
      success: false,
      message: "닉네임은 2자 이상 10자 이하로 입력해 주세요.",
      data: null,
    };
  }

  if (process.env.NEXT_PUBLIC_IS_MOCK === "true") {
    return new Promise((resolve) => {
      setTimeout(() => {
        revalidateTag("user");
        return resolve({
          success: true,
          message: "닉네임 수정에 성공했습니다.",
          data: null,
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

        const usersCollection = db.collection<User>("users");

        const result = await usersCollection.updateOne(
          { _id: userId },
          { $set: { nickname } },
        );

        if (result.acknowledged) {
          // 사용자 프로필 캐시 무효화
          revalidateTag("user");
          return {
            success: true,
            message: "닉네임 수정에 성공했습니다.",
            data: null,
          };
        } else {
          return {
            success: false,
            message: "닉네임 수정에 실패했습니다.",
            data: null,
          };
        }
      } catch (e) {
        console.error("Update nickname error:", e);
        return {
          success: false,
          message: "닉네임 수정에 실패했습니다.",
          data: null,
        };
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

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 이메일 수정
export async function updateUserEmail(
  userId: string,
  email: string,
): ServerResponseType<null> {
  if (!userId) {
    return {
      success: false,
      message: "유저 정보를 찾을 수 없습니다.",
      data: null,
    };
  }

  if (!email || !emailRegex.test(email)) {
    return {
      success: false,
      message: "이메일 형식이 올바르지 않습니다.",
      data: null,
    };
  }

  if (process.env.NEXT_PUBLIC_IS_MOCK === "true") {
    return new Promise((resolve) => {
      setTimeout(() => {
        revalidateTag("user");
        return resolve({
          success: true,
          message: "이메일 수정에 성공했습니다.",
          data: null,
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

        const usersCollection = db.collection<User>("users");

        const result = await usersCollection.updateOne(
          { _id: userId },
          { $set: { email } },
        );

        if (result.acknowledged) {
          // 사용자 프로필 캐시 무효화
          revalidateTag("user");
          return {
            success: true,
            message: "이메일 수정에 성공했습니다.",
            data: null,
          };
        } else {
          return {
            success: false,
            message: "이메일 수정에 실패했습니다.",
            data: null,
          };
        }
      } catch (e) {
        console.error("Update email error:", e);
        return {
          success: false,
          message: "이메일 수정에 실패했습니다.",
          data: null,
        };
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
