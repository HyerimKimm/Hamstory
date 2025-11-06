"use server";

import { destroyAuthSession } from "@/lib/user/auth";

import { ServerResponseType } from "@/types/serverResponse";

export default async function logout(): ServerResponseType<null> {
  if (process.env.NEXT_PUBLIC_IS_MOCK === "true") {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            success: true,
            message: "로그아웃에 성공했습니다.",
            data: null,
          }),
        1000,
      );
    });
  } else {
    const result = await destroyAuthSession();

    if (result.success) {
      return {
        success: true,
        message: "로그아웃에 성공했습니다.",
        data: null,
      };
    } else {
      return {
        success: false,
        message: "로그아웃에 실패했습니다.",
        data: null,
      };
    }
  }
}
