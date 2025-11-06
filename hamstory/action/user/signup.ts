"use server";

import { hashUserPassword } from "@/lib/user/hash";
import dayjs from "dayjs";
import { MongoClient, ObjectId } from "mongodb";

import { Blog, User } from "@/types/collection";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

export default async function signup(
  prevState: {
    success: boolean;
    message: string;
    data: string | object | null;
  },
  formData: FormData,
) {
  if (process.env.NEXT_PUBLIC_IS_MOCK === "true") {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            success: true,
            message: "회원가입 성공",
            data: {
              acknowledged: true,
              insertedId: "user1", // 이미 문자열
            },
          }),
        1000,
      );
    });
  } else {
    const client = new MongoClient(url, {
      serverSelectionTimeoutMS: 5000, // 5초 타임아웃
      connectTimeoutMS: 10000, // 연결 타임아웃 10초
    });

    try {
      await client.connect();

      try {
        const db = client.db("hamstory");

        // Collection을 User 타입으로 타입 지정
        const usersCollection = db.collection<User>("users");
        const blogsCollection = db.collection<Blog>("blogs");

        // 문자열 ID 생성 (ObjectId를 문자열로 변환)
        const userId = new ObjectId().toString();

        //문자열 blogId 생성 (ObjectId를 문자열로 변환)
        const blogId = new ObjectId().toString();

        const result = await usersCollection.insertOne({
          _id: userId, // 이제 타입 에러 없이 string으로 사용 가능
          nickname: formData.get("nickname") as string,
          email: formData.get("email") as string,
          password: hashUserPassword(formData.get("password") as string),
          profile_image_public_id: "",
          profile_image_url: "",
          blog_id: blogId,
        });

        // 유저 생성 성공 시 블로그 생성
        if (result.acknowledged) {
          const blogResult = await blogsCollection.insertOne({
            _id: blogId,
            user_id: userId,
            title: `${formData.get("nickname")}의 블로그`,
            description: `안녕하세요, ${formData.get("nickname")}님의 블로그입니다.`,
            created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          });

          // 블로그 생성 성공 시 유저 생성 성공 반환
          if (blogResult.acknowledged) {
            return {
              success: true,
              message: "회원가입 성공",
              data: {
                acknowledged: result.acknowledged,
                insertedId: userId, // 이미 문자열
              },
            };
          } else {
            // 등록된 유저 정보도 지우기
            await usersCollection.deleteOne({ _id: userId });

            return {
              success: false,
              message: "블로그 생성 실패",
              data: null,
            };
          }
        } else {
          return {
            success: false,
            message: "회원가입 실패",
            data: null,
          };
        }
      } catch (e) {
        console.error("Signup database operation error:", e);
        return {
          success: false,
          message: "회원가입 처리 중 오류가 발생했습니다.",
          data: null,
        };
      } finally {
        client.close();
      }
    } catch (error) {
      // MongoDB 연결 실패 에러 처리
      console.error("Signup database connection error:", error);

      const errorMessage =
        error instanceof Error && error.message.includes("timeout")
          ? "데이터베이스 연결 시간이 초과되었습니다. 잠시 후 다시 시도해주세요."
          : error instanceof Error && error.message.includes("connect")
            ? "데이터베이스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
            : "데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.";

      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  }
}
