"use server";

import { createAuthSession } from "@/lib/user/auth";
import { verifyPassword } from "@/lib/user/hash";
import { MongoClient } from "mongodb";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

export default async function login(
  prevState: {
    success: boolean;
    message: string;
    data: string | object | null;
  },
  formData: FormData,
) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      success: false,
      message: "이메일과 비밀번호를 모두 입력해주세요.",
      data: null,
    };
  }

  if (process.env.NEXT_PUBLIC_IS_MOCK === "true") {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            success: true,
            message: "로그인에 성공했습니다.",
            data: {
              _id: "user1",
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
        const collection = db.collection("users");

        /* 입력받은 이메일, 비밀번호로 유저 정보 조회 */
        const user = await collection.findOne({ email });

        if (!user) {
          return {
            success: false,
            message: "존재하지 않는 이메일입니다.",
            data: null,
          };
        }

        /* 해시된 비밀번호 검증 */
        const isPasswordValid = verifyPassword(
          user.password,
          password as string,
        );

        if (!isPasswordValid) {
          return {
            success: false,
            message: "비밀번호가 일치하지 않습니다.",
            data: null,
          };
        }

        /* 클라이언트로 전달할 사용자 정보 (비밀번호 제외) */
        const userForClient = {
          _id: user._id,
          nickname: user.nickname,
          email: user.email,
          // password는 클라이언트로 전달하지 않음
        };

        await createAuthSession(user._id as any); // 로그인 성공했으니까 클라이언트 요청 시 헤더에 세션 쿠키 추가

        return {
          success: true,
          message: "로그인에 성공했습니다.",
          data: userForClient,
        };
      } finally {
        client.close();
      }
    } catch (error) {
      // MongoDB 연결 실패 또는 기타 에러 처리
      console.error("Login error:", error);

      // 연결이 이미 열려있을 수 있으므로 안전하게 닫기 시도
      try {
        await client.close();
      } catch (closeError) {
        // 연결 닫기 실패는 무시
      }

      const errorMessage =
        error instanceof Error && error.message.includes("timeout")
          ? "데이터베이스 연결 시간이 초과되었습니다. 잠시 후 다시 시도해주세요."
          : error instanceof Error && error.message.includes("connect")
            ? "데이터베이스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
            : "로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  }
}
